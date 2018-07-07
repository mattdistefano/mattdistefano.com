import { h } from 'preact';
import { RoutableProps } from 'preact-router';
import { PageCache } from '../../models';
import {
  PageHeaderComponent,
} from '../../components/page-header';

import { MarkupComponent } from '../../components/markup';

import { ImageComponent } from '../../components/image';

import { PreComponent } from '../../components/pre';

import { IconComponent } from '../../components/icon';

export interface StyleGuideRouteProps extends RoutableProps {
  pageCache?: PageCache;
  url?: string;
}

const codeString = `code {
  background: var(--color-lightest-grey);
  font-size: 0.8rem;
  font-family: monospace;
  border-radius: 2px;
  padding: 2px 4px;
}`;

// tslint:disable-next-line:variable-name
export const StyleGuideRouteComponent = (props: StyleGuideRouteProps) => {
  const page = props.pageCache && props.pageCache[props.url] && props.pageCache[props.url].data;

  if (!page || page.type === 'summary') {
    return <div className="container">Loading!</div>;
  }

  const content = page.type === 'page' ? (
    <MarkupComponent
      markup={page.content} />
  ) : null;

  return <div>
    <PageHeaderComponent
      title={page.title}
      summary={page.summary}
      created={page.created} />
    <div className="page-content container animation-slide-fade-in animation-delay-2">
      <h2>Colors</h2>

      <h3>Palette</h3>

      <ul className="list-flex list-flex--square">
        <li style={{ backgroundColor: '#ffffff' }}>
          #ffffff
      </li>
        <li style={{ backgroundColor: '#f4f6f7' }}>
          #f4f6f7
      </li>
        <li style={{ backgroundColor: '#e9ebec' }}>
          #e9ebec
      </li>
        <li style={{ backgroundColor: '#6F6D6D', color: '#fff' }}>
          #6F6D6D
      </li>
        <li style={{ backgroundColor: '#5a5959', color: '#fff' }}>
          #5a5959
      </li>
        <li style={{ backgroundColor: '#111111', color: '#fff' }}>
          #111111
      </li>
        <li style={{ backgroundColor: '#ff004e', color: '#fff' }}>
          #ff004e
      </li>
        <li style={{ backgroundColor: '#e00043', color: '#fff' }}>
          #e00043
      </li>
      </ul>

      <h3>Backgrounds</h3>

      <ul className="list-flex list-flex--square">
        <li style={{ backgroundColor: '#ffffff' }}>
          #ffffff
      </li>
        <li style={{ backgroundColor: '#f4f6f7' }}>
          #f4f6f7
      </li>
        <li style={{ backgroundColor: '#e9ebec' }}>
          #e9ebec
      </li>
      </ul>

      <h3>Text</h3>

      <ul>
        <li style={{ color: '#6F6D6D' }}>
          #6F6D6D: a light text variant.
      </li>
        <li style={{ color: '#5a5959' }}>
          #5a5959: the base text color.
      </li>
        <li style={{ color: '#111111' }}>
          #111111: a dark text color, sometimes used as a hover/focus state.
      </li>
        <li style={{ color: '#ff004e' }}>
          #ff004e: the link color.
      </li>
        <li style={{ color: '#e00043' }}>
          #e00043: the link hover/focus color.
      </li>
      </ul>

      <h3>Combinations</h3>

      <ul className="list-flex list-flex--square">
        <li style={{ backgroundColor: '#ffffff', color: '#6F6D6D' }}>
          #ffffff
        <br />
          #6F6D6D
      </li>
        <li style={{ backgroundColor: '#ffffff', color: '#5a5959' }}>
          #ffffff
        <br />
          #5a5959
      </li>
        <li style={{ backgroundColor: '#ffffff', color: '#111111' }}>
          #ffffff
        <br />
          #111111
      </li>
        <li style={{ backgroundColor: '#ffffff', color: '#ff004e' }}>
          #ffffff
        <br />
          #ff004e
      </li>
        <li style={{ backgroundColor: '#ffffff', color: '#e00043' }}>
          #ffffff
        <br />
          #e00043
      </li>

        <li style={{ backgroundColor: '#f4f6f7', color: '#6F6D6D' }}>
          #f4f6f7
        <br />
          #6F6D6D
      </li>
        <li style={{ backgroundColor: '#f4f6f7', color: '#5a5959' }}>
          #f4f6f7
        <br />
          #5a5959
      </li>
        <li style={{ backgroundColor: '#f4f6f7', color: '#111111' }}>
          #f4f6f7
        <br />
          #111111
      </li>
        <li style={{ backgroundColor: '#f4f6f7', color: '#ff004e' }}>
          #f4f6f7
        <br />
          #ff004e
      </li>
        <li style={{ backgroundColor: '#f4f6f7', color: '#e00043' }}>
          #f4f6f7
        <br />
          #e00043
      </li>

        <li style={{ backgroundColor: '#e9ebec', color: '#6F6D6D' }}>
          #e9ebec
        <br />
          #6F6D6D
      </li>
        <li style={{ backgroundColor: '#e9ebec', color: '#5a5959' }}>
          #e9ebec
        <br />
          #5a5959
      </li>
        <li style={{ backgroundColor: '#e9ebec', color: '#111111' }}>
          #e9ebec
        <br />
          #111111
      </li>
        <li style={{ backgroundColor: '#e9ebec', color: '#ff004e' }}>
          #e9ebec
        <br />
          #ff004e
      </li>
        <li style={{ backgroundColor: '#e9ebec', color: '#e00043' }}>
          #e9ebec
        <br />
          #e00043
      </li>
      </ul>

      <h2>Typography &amp; other content styles</h2>

      <h3>Headings</h3>

      <div className="h1">h1 - Raleway 400</div>
      <div className="h2">h2 - Raleway 700</div>
      <div className="h3">h3 - Raleway 700</div>
      <div className="h4">h4 - Raleway 700</div>
      <div className="h5">h5 - Raleway 700</div>
      <div className="h6">h6 - Raleway 700</div>

      <h3>Copy</h3>
      <p>Open Sans 1rem (16px)</p>

      {/* tslint:disable */}
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nullam eget felis eget nunc. Tortor consequat id porta nibh venenatis cras sed felis.</p>
      <p>Vitae congue eu consequat ac felis. Rhoncus urna neque viverra justo nec. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim. Feugiat nibh sed pulvinar proin gravida hendrerit lectus. Quis vel eros donec ac odio tempor orci. Enim facilisis gravida neque convallis a. Sem viverra aliquet eget sit amet tellus cras adipiscing enim.</p>

      <h3>Links</h3>

      <h4>Standard</h4>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut <a href="#">labore et dolore</a> magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco <a href="#">laboris nisi ut aliquip</a> ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h4>Muted</h4>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut <a href="#" class="link-muted">labore et dolore</a> magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco <a href="#" class="link-muted">laboris nisi ut aliquip</a> ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h3>Buttons</h3>
      <p style="margin-left: -1rem; margin-right: -1rem;">
        <button style="margin: 1rem" type="button" class="btn">Button</button>
        <button style="margin: 1rem" type="button" class="btn btn--muted">Muted Button</button>
        <button style="margin: 1rem" type="button" class="btn btn--arrow">Arrow Button</button>
      </p>

      <h3>Link Buttons</h3>
      <p>
        <button type="button" class="btn btn--link">Link Button</button>
        <button type="button" class="btn btn--link btn--muted">Muted Link Button</button>
      </p>

      <h3>Inline Link Buttons</h3>
      <p>
        <button type="button" class="btn btn--link btn--link-inline">Inline Link Button</button> <button type="button" class="btn btn--link btn--link-inline btn--muted">Muted Inline Link Button</button>
      </p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut <button type="button" class="btn btn--link btn--link-inline">labore et dolore</button> magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco <button type="button" class="btn btn--link btn--link-inline btn--muted">laboris nisi ut aliquip</button> ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h3>Lists</h3>

      <h4>Unordered</h4>

      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
      </ul>

      <h4>Ordered</h4>

      <ol>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
      </ol>

      {/* TODO: definition lists */}

      <h3>Blockquote</h3>

      <blockquote>
        Yo this is a fucken quote.
      </blockquote>

      <h3>Code</h3>

      <p>
        <code>Lorem ipsum dolor sit amet</code>, consectetur adipiscing elit, sed do eiusmod tempor.
      </p>

      <pre><code>
        {codeString}
      </code></pre>

      <h3>Video embeds</h3>

      <div className="video-embed video-embed--youtube">
        <iframe src="//www.youtube.com/embed/XoYu7K6Ywkg" width="640" height="390" frameBorder="0" allowFullScreen></iframe>
      </div>

      <h2>Components</h2>

      <h3>Icon</h3>

      <blockquote><p>Renders the specified icon as an inline SVG.</p></blockquote>

      <ul class="list-flex list-flex--square">
        <li><IconComponent title="Twitter" name="twitter" size={22} /></li>
        <li><IconComponent title="Github" name="github" size={22} /></li>
        <li><IconComponent title="LinkedIn" name="linkedin" size={22} /></li>
        <li><IconComponent title="RSS" name="rss" size={22} /></li>
      </ul>

      <h3>Image</h3>

      <blockquote><p>Wraps an image with additional markup and behavior.</p></blockquote>

      <ImageComponent src="/blog/2017/11/26/flowers.jpg" alt="Some pretty pretty flowers" />

      <h3>Pre</h3>

      <blockquote><p>Wraps pre-formatted content in additional markup and behavior.</p></blockquote>

      <PreComponent>
        <code>{codeString}</code>
      </PreComponent>

      <h3>Markup</h3>

      <blockquote><p>Processes markup into Preact components (using <a href="https://github.com/developit/preact-markup" target="_blank">Preact Markup</a>) w/ pre-configured component substitution.</p></blockquote>

      {content}
    </div>
  </div>;
};
