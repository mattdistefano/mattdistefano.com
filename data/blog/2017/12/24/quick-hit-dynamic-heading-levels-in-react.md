---
created: December 24, 2017
summary: A brief overview of creating dynamic heading levels in React.
---

# Quick hit: dynamic heading levels in React

As I discussed in my previous article on [accessible headings](/blog/2017/12/06/accessibility-101-using-headings-effectively), it's sometimes necessary to utilize different heading levels on the same component or piece of content. At first glance, this might seem like it would require code duplication, but we can get around that quite easily in React.

## Code example

```typescript
export interface ComponentWithDynamicHeadingProps {
  headingLevel?: number;
  headingText?: string;
}

export const ComponentWithDynamicHeading = (props: ComponentWithDynamicHeadingProps) => {
  const headingText = { __html: props.headingText };

  const Heading = `h${props.headingLevel || 2}`;

  return <Heading dangerouslySetInnerHTML={headingText} />;
};

export const ParentOfComponentWithDynamicHeading = () => {
  return (
    <div>
      <ComponentWithDynamicHeading headingLevel={1} headingText="Heading level 1" />
      <ComponentWithDynamicHeading headingText="Heading level 2" />
      <p>Content...</p>
      <ComponentWithDynamicHeading headingText="Heading level 2" />
      <p>Content...</p>
    </div>
  );
}
```

First, we include an optional `headingLevel` property in the component's props interface declaration. This allows us to pass in the desired heading level from the parent.

Second, in the component itself, we dynamically construct the tag name (using template literals) from the `headingLevel` prop. And, since we made `headingLevel` optional, we include a default heading level. (The logic here could certainly be much more robust --- for example, only allowing values between 1 and 6, or within a narrower range of expected usage --- or we could remove it entirely and make `headingLevel` required.) 

Third, we assign the constructed tag name to a *capitalized* constant and use this constant as though it were a user-defined component. This can feel a little hacky --- we would typically reserve capitalized variable names for constructable functions/classes, after all --- but JSX only allows lowercase names for its built-in types. Ultimately, though, the code compiles down and executes as `React.createElement('h' + props.headingLevel)`, which is equivalent to having coded a `<h1 />`, `<h2 />`, `<h3 />`, etc, in our JSX originally. So, if we pass in `headingLevel={3}` we'll get `React.createElement('h3')` --- just as if we had coded `<h3></h3>` to begin with.

Now, when we use the component in our app, we just need to pass the necessary heading level as a property.