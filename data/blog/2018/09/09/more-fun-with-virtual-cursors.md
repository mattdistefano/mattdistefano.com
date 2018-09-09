---
created: September 9, 2018
summary: Using translate-based transitions with screen readers.
---

# More fun with virtual cursors

I wrote the other day about [some challenges](/blog/2018/08/12/visually-hidden-and-virtual-cursors) using screen readers *visually* with my preferred technique for accessible checkboxes and radios.

We've been doing more testing for this use case lately at work and uncovered another interesting issue. It appears that, when calculating the position/dimensions of the virtual cursor's visual outline, some browsers/screen readers seem to struggle with transitions (and probably animations, though I didn't test this yet) applied to CSS translates. Instead of drawing the outline around the element's translated position at the end of the transition, they tend to draw it around the element's original position at the start of the transition. 

For example, here is a screenshot from [Bootstrap's modal demo](https://getbootstrap.com/docs/4.1/components/modal/) showing the outline that is drawn when the virtual cursor is on the grey 'Close' button:

![Modal dialog with outline drawn above, rather than around, the close button.](/blog/2018/09/09/bootstrap-modal.png)

This is because Bootstrap uses a `transform: translate(0,-25%);` which is then transitioned to `    transform: translate(0,0);` to give the modal its 'drop-in' effect. Here's a [similar issue on Stackoverflow](https://stackoverflow.com/questions/23957001/how-to-control-apple-voiceovers-thick-black-border-around-elements).

The issue is somewhat intermittent and seems to vary by browser. For example, VO + Safari on OS X works better than VO + Chrome on OS X, though VO + Safari on iOS still seems to have issues, as does TalkBack + Chrome on Android.

I experimented with a couple possible fixes that didn't pan out. First, triggering a reflow at the end of the transition. Second, focusing the dialog a second time at the end of the transition. Neither had any impact. 

What eventually did work was updating the modal CSS to also transition the `top` property from a very small negative offset (`-0.1px` for example) to 0. This seemed to kick the browser/screen reader into recalculating the position correctly. 

I'm not particularly happy with this solution, however. Animating transforms rather than `top`, `bottom`, etc, has been a performance best-practice for years. I didn't experience noticeable performance degradation in this case, but would still prefer a pure `transform`-based animation. Likewise, this is just a hacky fix, and like all hacky fixes, it's apt to be easy to mess up, won't work for every use case, or will stop working 3 browser updates from now. 

That said, what's broken here realistically is the browser and/or screen reader, so hacky fixes may be all we can do for the time being. This is one of the most frustrating aspects of trying to develop for accessibility -- many things just don't work consistently across different combinations of browser + OS + AT. Browser vendors have done an amazing job of committing to standards over the last decade or so, but trying to troubleshoot accessibility issues, you'd half think you were back in the days of Netscape vs. IE. 
