---
created: January 15, 2018
summary: Best practices for implementing accessible forms.
---

# Developing accessible forms

Forms--with their myriad different input types, validation requirements, and interaction patterns--are one of the most difficult aspects of accessibility to get right. 

While the details are quite complicated, the ultimate goal of accessible forms is simple: an equitable experience for all users, regardless of how they experience or interact with the form. This is to say, the information present in the form (labels, values, validation status, etc) must be communicable through a variety of media (visual, auditory, tactile, etc), while functionality (editing fields, submitting) must be exposed to a variety of input methods (mouse, keyboard, touch). 

Designers and developers usually focus primarily on building for a visual medium; meaning is conveyed through visual organization of elements on screen, color coding, or other cues. 

## Basic HTML structure of a form

Forms typically contain one or more inputs along with a submit button.

In almost all cases, the markup for a form should look something like this:

```html
<form>
  <!-- inputs -->
  <button type="submit">Submit</button>
</form>
```

Obviously this is a contrived example and a real-world form would be more complex, but the key points here are:

1) The inputs and submit button are contained within a `form` tag.
2) The submit button is a `button` tag with `type="submit"` (`input type="submit"` also works but is not as flexible from a styling standpoint).

By using a `form` tag, we ensure the form is identified as a [form landmark](https://www.w3.org/TR/wai-aria-1.1/#form), making it easier for users of AT to discover. By using a `button` tag, we ensure the submit button is focusable and keyboard operable. And by using `button type="submit"` with the `form`, we can easily take advantage of some built-in browser behavior. [Implicit submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission) (i.e. submitting when the 'enter' key is pressed within an input), makes the form easier to use on a keyboard. It also gives us a convenient hook for disabling form submission (via the `disabled` attribute/property on the submit button). And, as we'll see later, the form's [submit event](https://developer.mozilla.org/en-US/docs/Web/Events/submit) gives us a hook for adding client-side behavior around validation and focus management.

It's common to see examples of forms in the wild where a `form` tag is not used, or a submit "button" is crafted with different elements (perhaps a span with an `onclick` to submit the form). These are almost always wrong, and, in many cases, end up requiring more code to duplicate what the browser gives us for free with standard, semantic HTML.

## Labeling fields

Form inputs must be labelled, and in most cases, forms will be designed with visible labels for the input. The markup for these should look something like this:

```html
<label>
  Label text
  <input />
</label>
```

Or:

```html
<label for="input-1">
  Label text
</label>
<input id="input-1" />
```

(Note that the `input` tag here could also be a `select`, `textarea`, etc.)

The key point here is that there is a programmatically-determinable relationship established between the input and its respective label. In the former case, we do this by nesting the `input` inside the `label`; in the latter case, we place the `input`'s `id` attribute value in the `label`'s `for` attribute. 

By using a `label` that is correctly associated with its `input`, we achieve the following:

1) The browser will treat clicks on the label essentially the same as it would clicks on the input itself; in effect, the click target for the input is enlarged. For radio buttons and checkboxes, which would otherwise have a very small click target, this is particularly important. Having healthy click target sizing is important not only for users who have difficulty w/ precise mouse operations, but also for mobile users.
2) The label content will be included in the input's accessible name. This means that, when assistive technology (such as a screen reader) encounters the input, the label content will be announced to the user. Without this, the user would have a difficult time identifying the purpose of the input, or differentiating it from other inputs.

In the wild, it's extremely common to see forms that don't utilize `label` tags, or don't utilize them in a way that actually expresses the association between the `label` and the `input`. Again, this is almost always wrong.

### Placeholders and invisible labels

In recent years, it's become common to include placeholders (or, "ghost text") within inputs, in some cases even omitting separate labels outside of the inputs.

In HTML, basic placeholders can be implemented with the `placeholder` attribute on the `input`. 

Note that, from an accessibility standpoint, the placeholder is not a substitute for a label. If the design includes a visible label, code it using one of the `label` patterns described above. 

If the design does not call for a visible label, one must still be provided. There's a couple ways to accomplish this:

1) The `aria-label` attribute may be used on the input to specify the label text.
2) The `aria-labelledby` attribute may be used to specify the *id* of another element containing the label text.
3) One of the `label` patterns above may be used, with the `label` itself or its text hidden from view in an accessible manner.

## Grouping inputs

Many forms will have groups of multiple related inputs. For example, radio buttons can realistically *only* be used in groups, while other inputs may be grouped to collect multi-part (for example, the street, city, state, and zip of an address). 

We can use the `fieldset` tag to group inputs, with a `legend` to label the group like so:

```html
<fieldset>
  <legend>Group label</legend>
  <label>
    <input type="radio" name="radio-group" value="1" />
    Option 1
  </label>
  <label>
    <input type="radio" name="radio-group" value="2" />
    Option 2
  </label>
  <label>
    <input type="radio" name="radio-group" value="3" />
    Option 3
  </label>
</fieldset>
```

While the `legend` is technically optional, it's a good practice to include one (hidden--in an accessible manner--if necessary). The exact impact of utilizing a `fieldset` and `legend` varies by browser and AT, but typically, when an input within the `fieldset` receives focus, the `legend` will be announced in addition to the input's `label`.

## Communicating required fields

Even the simplest of forms will typically have required fields.

Required fields will usually be visually differentiated from other fields. To convey that same information to non-visual media, use the `required` attribute introduced in HTML. For example (assuming that the * conveys the "requiredness" of the field to sighted users):

```html
<label for="input-1">
  Label text*
</label>
<input id="input-1" required />
```

Browser/AT support for `required` is good these days, but it's not a bad idea to also include `aria-required="true"`.

```html
<label for="input-1">
  Label text*
</label>
<input id="input-1" required aria-required="true" />
```

## Communicating other constraints

It's common for more complex forms to have other constraints. Input may be required in a specific format, may have a minimum or maximum length, or may depend on the values of other fields. Implementing these constraints is outside the scope of this article. 

## Handling client-side validation errors



## Communicating server-side validation errors

Use form tags and submit buttons
Use proper labels
Use fieldsets/legends
Use native html elements, visually-replaced elements, or follow aria design patterns
Use required
Use aria-describedby for descriptions
Use aria-describedby for errors
Use aria-invalid for invalid fields
Focus first invalid field when submitting
  Or show error message at top of form and focus
