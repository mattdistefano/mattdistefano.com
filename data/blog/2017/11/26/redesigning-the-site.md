---
created: November 26, 2017
summary: A walk-through of what I'm doing w/ the site.
bannerUrl: /blog/2017/11/26/flowers.jpg
bannerAlt: Flowers, Cape Disappointment, June 2016.
---

# Redesigning the site before I'm even done building it

I have been trying to get this thing back off the ground for a while now, but have also been super-busy at work and super-lazy at home. So, of course, rather than adding content or fixing bugs, I decided to redesign it over the Thanksgiving weekend. 

Given all that, let's walk through what I'm trying to do here (at least from a technology standpoint).

## Static site

First, I wanted to build this out as an (almost) fully static site. There's a couple reasons for this:

1. Most of my server-side development experience is on .NET, but I didn't want to remain with my .NET host or jump through the hoops of setting up a .NET dev environment on my Mac (though I should take a look at .NET core one of these days).
2. I didn't want to deal with the overhead of a database, content authoring experience, etc.
3. I was planning to use React, and at the time I started this project, React's server-side rendering performance was pretty poor (I believe this has improved with 16.x, though). 
4. Static sites are a bit easier to integrate w/ modern frontend tooling.

## Markdown-based content w/ file-system-based IA

As noted, I didn't want to deal with a database and content authoring experience. From a development standpoint, it's just a lot of work, and from a user standpoint, I'm not keen on shoving all my content into a proprietary storage format (even if it's one I contrived myself).

I've grown pretty fond of markdown over the years. It makes for a very simple and readable authoring experience, allowing me to focus on content rather than fiddling around with a WYSIWYG editor. And because I wanted to utilize structured, readable URLs in any case, it just made sense to represent the site IA as a series of markdown files within folders (almost identical to just authoring a fully static HTML site).

## Pre-rendering of all pages w/ seamless hand-off to client-side routing/state

Finally, I wanted to pre-render the entire site, but seamlessly transition to client-side rendering and routing. Again, there's a couple reasons for this:

1) First-paint performance is improved, because the rendered HTML is present in the initial page load and the browser doesn't need to wait on the load of JS assets.
2) Search engine indexing is more reliable (crawlers do handle client-side rendering reasonably-well these days, but server-rendering will always be safe). The performance boost also produces better SEO.
3) It's nominally more reliable overall (i.e. on slow networks, in the absence of JS, etc).

## Putting it together

Thankfully, this all wasn't too hard to achieve. 

### Site generator

I wrote a [site generator library](https://github.com/mattdistefano/site-generator) that handles various concerns:

- Reading the markdown files out of the file system and converting to JS `Page` objects containing the rendered HTML and various bits of metadata (both from the file system, front-matter, and the markdown itself). 
- Summarizing the contents of each directory into its index page.
- Generating default index pages for each directory that doesn't have an explicit index page.
- Processing a (very hacky) query syntax to allow pages to surface content from elsewhere in the file system.

This lib also exports typescript definitions that I utilize throughout the rest of the project.

### Webpack plugin

I also wrote a [webpack plugin](https://github.com/mattdistefano/site-generator-webpack-plugin) that integrates with the site generator lib to address some build-time concerns:

- Watching the source markdown files during development mode and invoking the lib to produce an array of `Page`s.
- Loading the compiled app in a node VM and invoking a pre-renderer function to obtain the complete app HTML for each `Page`.
- Appending the JSON state object to the HTML for later consumption by React.
- Inserting that HTML into the template used by [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) to produce a complete HTML page.
- Adding that HTML page to the webpack file output.
- Adding the JSON-serialized `Page` to the webpack file output.

### React pre-rendering

The app code exports a pre-rendering function, which accepts an array of `Page`s and uses [react-router](https://github.com/ReactTraining/react-router)'s `StaticRouter` to match the file-system path of the `Page` to a route defined in the app and return the rendered string. 

While React and react-router both support this type of rendering scenario, the app code itself also  needs to check for the existence of browser APIs before using them, since the browser globals/APIs aren't available w/in the node VM.

### React client-rendering

Now, the first page load uses the pre-rendered HTML. When the JS bundle loads, its state hydrates from the serialized state object present in the HTML. Upon navigation to subsequent pages, the app loads the requested `Page` via JSON and does all the rendering and history management client-side.  

## What remains to be done

All kinds of things.

- Properly handling URLs with or without a slash.
- Adding banner dimensions to `Page` meta data.
- Cleaning up duplicated state management logic.
- Rendering `img` tags with a `srcset` and autogenerating the necessary files.
- Migrating to my new linux host and adding CI builds.
- Adding a repo for content.
- Completing unit tests.
- _Maybe_ migrating to preact.
- Adding microdata.
- Improving loading states.
- Handling markdown-rendered links via react-router.
- Fixing up the HOCs that react-router no longer likes.
- Improving `Query` support.
- Triggering reload on content change.
- Etc.