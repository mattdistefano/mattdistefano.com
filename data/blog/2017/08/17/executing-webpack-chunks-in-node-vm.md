---
created: August 17, 2017
summary: A walk-through of executing multiple webpack chunks in a node VM.
---

# Executing webpack chunks in a node VM

The static site generator I built for this site was very much inspired by [Mark Dalgleish](http://markdalgleish.com/)'s [webpack plugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin). One thing I didn't like about Mark's plugin, however, is the lack of support for code splitting across multiple chunks. This article explains how I (somewhat-hackily) solved that problem.

## Background

The goal here is to create a React application that can do its own pre-rendering as part of the webpack compilation cycle (vs. doing a crawl/scrape after the fact). This means the application needs to be executable in both a browser and node environment.

React itself has good support for this scenario, and it's fairly simple to node-proof client-side code by checking for the presence of browser APIs before using them. Webpack likewise can easily be configured to emit a UMD format, which is consumable in both environments, and a webpack plugin can be used to perform the pre-rendering.

So, high-level, the process looks something like this:

1. The application code exports a method to render the React app to static HTML
2. Webpack compiles the application code into a UMD format
3. On emit, the webpack plugin...
    1. Finds the compiled application code UMD asset within the webpack compilation
    2. Loads that code into a node VM
    3. Grabs a reference to the exported render method (via the VM)
    4. Executes the render method
    5. Adds the render output to the compilation assets

This works great if you're outputting a single chunk, but what happens when you want to use multiple chunks via CommonsChunkPlugin? Turns out that's a little more complicated. In short, the chunks need to be executed in the VM in a specific order and with specific accomodations for the UMD wrapper.

## Sorting the chunks

First, we need to sort the chunks in order of dependency; this doesn't seem to be built in to webpack, but there is a [npm package](https://www.npmjs.com/package/webpack-sort-chunks) for it. Once sorted, we can extract the "source" (which is really the webpack-compiled output) from the compilation.

```typescript
const stats = compilation.getStats().toJson();

const sortedChunks = sortChunks(stats.chunks);

const chunkAssets = sortedChunks.map(chunk =>
  compilation.assets[chunk.files[0]].source()
);
```

## Handling webpackJsonp

Second, we need to execute the chunks (in order) in the VM. This is a little more complicated. The first problem we run into is how webpack packages the chunks; chunks are wrapped inside a `webpackJsonp` callback function, which is initially defined on `window`:

```javascript
window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {...}
```

But then referenced as a global in subsequent chunks:

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return webpackJsonp(...)
```

In a browser environment, this is fine, as `window` _is_ the global context. In a node VM, however, `window` doesn't even exist. Thankfully, this can be solved easily enough when defining our VM sandbox by creating a `window` property that is a reference to the sandbox itself.

```typescript
const sandbox = { };

sandbox.window = sandbox;

vm.runInNewContext('', sandbox);
```

Now webpack can bootstrap `webpackJsonp` onto `window` and subsequent chunks can find it on the sandbox.

## Executing multiple UMD modules

The next challenge we have is that the UMD wrapper expects its own `exports` and `module`, so we can't just concat + execute all the chunks w/ the same `exports` and `module`. Rather, we need to wrap each UMD module in its own IIFE to put a unique `exports` and `module` in scope. (This is basically a low-rent version of node's own module loader.)

So, putting it together...

```typescript
const sandbox = {
  allExports: {}
};

sandbox.window = sandbox;

const code = chunks
  .map((chunk, i) => `
    const chunk${i}Module = { exports: {} };
    
    (function(module, exports) {
      ${chunk};
    })(chunk${i}Module, chunk${i}Module.exports);

    Object.assign(allExports, chunk${i}Module.exports);
  `)
  .join('');

const result = vm.runInNewContext(code, sandbox);
```

Each UMD module (`${chunk}`) executes, setting all exports on its unique `module.exports`, which are then merged onto `allExports`, which is implicitly returned as `result`. The render function can then be plucked off `result`.

The one catch here is this could result in identically-named exports from different chunks overwriting each other, but for this use case, that's not a huge concern --- just give the render function export a name that's unlikely to clash.
