---
created: August 12, 2018
summary: Ensuring visually-hidden controls work for low-vision users.
---

# Visually hidden elements and virtual cursors

Typically, when I need to create a styled checkbox or radio button, I use a technique that looks something like this:

```css
.checkbox input {
  /* BS4 .sr-only */
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  clip-path: inset(50%);
  border: 0;
}

.checkbox input + label::before {
  /* control outline */
}

.checkbox input + label::after {
  /* control checked indicator; unchecked state */
}

.checkbox input:checked + label::after {
  /* control checked indicator; checked state */
}

.checkbox input:focus + label::before {
  /* control focus state */
}

.checkbox label:hover::before {
  /* control hover state */
}
```

```html
<div class="checkbox">
  <input type="checkbox" id="checkbox" />
  <label for="checkbox">Label</label>
</div>
```

Basically, we are hiding the actual `input` element from view, while retaining its ability to be focused, and reconstructing a styled version using the `label`'s psuedoelements.

For the most part, this works really well. With some creative CSS, the `::before` and `::after` psuedoelements are typically sufficient to create fancy checkboxes and radios without having to worry about cross-browser/platfrom-specific native `input` styles. Because we kept the `input` -- vs trying to reinvent it with JS -- and kept it focusable, we get built-in accessibility, integration with just about any JS framework, and no headaches dealing with form submission. And thanks to the adjacent sibling selector, we can drive the visual state of our styled control off the state of the hidden `input`, meaning we require no JS at all.

So, what's the problem?

For sighted users not using a screen reader, or non-sighted users who are using one, there is no problem. It actually just works. Even if only using a keyboard, both will be able to operate the control and perceive its state correctly. 

Where we run into issues is with low-vision users using a screen-reader to *aid* but not *replace* their visual interaction. 

If you've used a screen reader while observing the screen, you've probably noticed it draw a box around the element currently under the virtual cursor. This box is controlled entirely by the screen reader and is distinct from keyboard focus, meaning it will not trigger the `:focus` styles we've provided.

Now, because we've sized/clipped the actual `input` down to nothing, when the virtual cursor lands on it, no box will be drawn. This makes for a slightly weird experience for the user -- obviously *something* is there, as it is being read, but no box is drawn to help indicate what or where.

To fix, we just need to set a height/width and position to place the `input` roughly in the same space as our styled psuedoelements (setting a `appearance: none` and/or `opacity: 0` on the `input` probably isn't a bad idea either). The `input` itself will still be visually clipped, but because we've given it dimensions and positioning, the virtual cursor box will be drawn around the space it occupies, effectively making it look as though it is drawn around our styled control.
