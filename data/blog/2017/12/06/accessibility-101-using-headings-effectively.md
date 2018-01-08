---
created: December 6, 2017
summary: Best practices for implementing accessible headings.
---

# Accessibility 101: Using headings effectively

One of the common issues I encounter in design and code reviews is misuse of or confusion about headings. This article attempts to lay out some of the best practices I've adopted over the years.

## What are headings and what do they do?

Headings are brief pieces of text within a web page that serve a couple purposes. 

First, headings identify and describe blocks of content (or functionality) on the page. 

Second, by using multiple *levels* of heading, the organization of headings *in relation to each other* forms a hierarchal outline of the content on the page. If you've ever used a word processor to automatically generate a table of contents from your headings, this concept should be familiar.

## How do headings impact accessibility?

One of the common ways users of assistive technology (AT) handle orientation and navigation within a page is through examination of its heading structure. Screen readers, for example, offer shortcuts to list the headings on a page and allow users to jump directly to those headings; in this way, a screen reader user can quickly scan a page for the most interesting or relevant content.

Of course, if the headings are not present, not coded properly, or don't describe the content accurately, this functionality will not work well (or at all) and the user will have a difficult time accessing information on the page.

## How do we make headings accessible?

As with much else in accessibility, getting headings right requires involvement from designers, copywriters, and developers. 

### Considerations for content authors

Headings should succinctly describe the content or functionality that follows in the page.

Ideally, each heading within a page would be unique. Depending on the complexity of the page, this isn't always possible, but it's a good goal to strive for. When headings are duplicated, users may have trouble differentiating them. Likewise, it's a good idea to avoid repeating the same text at the start of multiple headings; when a user is quickly skipping through headings, they don't want to have to listen to the same text over and over.

Many sites have some common content or functionality that appears on multiple pages (for example, a site-wide footer or search bar). In most cases, [these items should use the same heading](https://www.w3.org/TR/UNDERSTANDING-WCAG20/consistent-behavior-consistent-functionality.html) on every page they appear. This consistency enables users to recognize those items as part of the global page structure and quickly ignore or access them as needed.

### Considerations for designers

As with any other text, headings must meet [minimum contrast requirements](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html). If you're overlaying your headings on an image or video, make sure to sample the contrast ratio at a number of points, and consider these requirements in selecting imagery. 

Avoid visual treatments that might be confused for other UI patterns. For example, underlined headings might be mistaken for links, while white-on-black reverse headings (made somewhat infamous by [mdn](https://developer.mozilla.org/en-US/)) may appear identical to highlighted text.

Review the designs in a color-blindness simulator to ensure that headings can be differentiated from other types of text and UI controls.

### Considerations for developers

Headings in HTML are implemented using the `h1`-`h6` tags. `h1`-`h6` tags should always be used for headings, since only these tags will be identified as headings to AT (technically, ARIA does define a `heading` role, but `h1`-`h6` are preferred). 

#### The document outline

The `h1` tag should be used for the top-level heading on the page. In many cases, this will be content similar to the page title. `h2`s should be used to mark up the major headings under the `h1`; `h3`s to mark up headings within the content headed by the `h2`s, and so on. Heading levels should not be skipped. Remember: the heading levels form an outline of your content.

The ideal outline looks something like this:

```
h1 - Page heading
  h2 - Section 1 heading
    h3 - Section 1.1 heading
    h3 - Section 1.2 heading
      h4 - Section 1.2.1 heading
  h2 - Section 2 heading
  h2 - Section 3 heading
    h3 - Section 3.1 heading
    h3 - Section 3.2 heading
      h4 - Section 3.2.1 heading
        h5 - Section 3.2.1.1 heading
      h4 - Section 3.2.2. heading
    h3 - Section 3.3 heading
  h2 - Section 4 heading
```

There's long been contention over whether to use multiple `h1` tags on a page. HTML5 looked to have solved this with the introduction of a new outlining algorithm and sectioning elements (`section`, `article`, etc), but [UA/AT support has lagged behind](http://adrianroselli.com/2016/08/there-is-no-document-outline-algorithm.html), so I typically still use a single `h1` and head up sectioning elements with an `h2` or lower.

#### Separation of content and presentation

It's important to note that the heading levels, from a *markup* standpoint, should reflect the organization and hierarchy of the page *as a document*, but won't always reflect the *visual treatment* mandated by designs. 

For a simple, content-heavy page like this one, where the page essentially *is* a document, the prescribed visual treatment often will follow the heading hierarchy quite well. In these cases, it's often enough to just apply a default set of styles to the `h1`-`h6` tags. (Having a sane set of typographical defaults is also immensely useful when it comes to dealing with content authored via markdown or a rich text editor).

For more complex content sites or web apps, it's often the case that the visual treatment specified in the designs won't line up with the heading levels that make sense from a content perspective. For example, a [bootstrap 3.x panel-heading](https://getbootstrap.com/docs/3.3/components/#panels-heading) will always have a consistent visual treatment, but, depending on where the panel is used in the page, it may require a `h2`, `h3`, `h4`, etc, tag. Likewise, a `caption` or `legend` may use the same visual treatment as a heading, but obviously can't use a heading tag.

In these cases, I typically prefer to apply a set of default styles to the `h1`-`h6` tags, duplicate those styles in a set of `.h1`-`.h6` classes, and ensure that any UI components (panels, cards, menus, etc) enforce their own styling irrespective of the tags used.

##### A note on uppercase headings

Some screen readers will interpret ALL CAPS as an abbreviation or acronym and read it letter by letter. When designs call for an ALL CAPS HEADING, try to place the content in the page in a normal Title Case format, then style with `text-transform: uppercase`. 

#### Handling missing headings

Sometimes, headings are omitted from a design because the element in question is visually distinct and follows established conventions that the typical sighted user would recognize. For example, the meaning of a site footer is often so visually obvious that it goes without a heading.

It's difficult to specify a single rule that can apply in these cases, but often some combination of semantic markup and/or ARIA can help. In the site footer example, by using a `footer` tag or `role="contentinfo"`, we can [express the same meaning to AT](https://www.w3.org/TR/wai-aria-practices/examples/landmarks/contentinfo.html). 

#### Reusing content in different contexts

Often, content within a CMS is used in different contexts throughout a site. This can make coding headings tricky, since a heading level appropriate for one usage of the content may not make sense in another context. 

Again, there's not a single way to solve this problem, but most solutions boil down to rendering headings *programmatically* rather than relying on a blob of WYSIWYG HTML. This may mean utilizing structured content to separate headings from their respective content, dynamically rewriting heading levels, etc.

#### Creating subheadings, subtitles, taglines, etc

Sometimes, a design will specify what appears to be a multi-level heading; i.e. a head and subhead, tagline, etc. It's tempting to mark these up with multiple heading tags, but that's typically not correct. [W3C's Common Idioms Without Dedicated Elements](https://w3c.github.io/html/common-idioms-without-dedicated-elements.html#subheadings-subtitles-alternative-titles-and-taglines) offers guidance on handling these requirements.