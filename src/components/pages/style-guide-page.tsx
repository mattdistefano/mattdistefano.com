import * as React from 'react';
import { Page, PageSummary, IndexPage } from '@mattdistefano/site-generator';
import { AsyncData } from '../../models';
import {
  PageFooterComponent,
  PageCardListComponent,
  PageContentComponent,
  StaticContentComponent,
  DateComponent,
  PageHeaderComponent,
  PageFooterProps,
  QueriesComponent
} from '../content';

const codeString = `code {
  background: var(--color-lightest-grey);
  font-size: 0.8rem;
  font-family: monospace;
  border-radius: 2px;
  padding: 2px 4px;
}`;

// tslint:disable-next-line:variable-name
export const StyleGuidePageComponent = () => <div>
  <PageHeaderComponent
    title="Style Guide"
    summary="Component and style reference"
    created="2018/07/02" />
  <div className="container">
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

    <h2>Typography</h2>

    <h3>Headings</h3>

    <div className="h1">h1 - Raleway 400 2.5rem (40px)</div>
    <div className="h2">h2 - Raleway 700 1.5rem (24px)</div>
    <div className="h3">h3 - Raleway 700 1.125rem (18px)</div>
    <div className="h4">h4 - Raleway 700 1rem (16px)</div>
    <div className="h5">h5 - Raleway 700 0.875rem (14px)</div>

    <h3>Copy</h3>
    <p>Open Sans 1rem (16px)</p>

    {/* tslint:disable */}
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nullam eget felis eget nunc. Tortor consequat id porta nibh venenatis cras sed felis.</p>
    <p>Vitae congue eu consequat ac felis. Rhoncus urna neque viverra justo nec. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim. Feugiat nibh sed pulvinar proin gravida hendrerit lectus. Quis vel eros donec ac odio tempor orci. Enim facilisis gravida neque convallis a. Sem viverra aliquet eget sit amet tellus cras adipiscing enim.</p>

    <h3>Links &amp; buttons</h3>

    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut <a href="#">labore et dolore</a> magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco <a href="#">laboris nisi ut aliquip</a> ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    <p><button type="button" className="button">Button</button></p>

    <h3>Lists</h3>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
    </ul>

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

    <h3>Combinations</h3>

    <div className="h2">Lorem ipsum dolor sit amet</div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
    </ul>
    <div className="h3">Lorem ipsum dolor sit amet</div>
    <ol>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
    </ol>
    <div className="h3">Lorem ipsum dolor sit amet</div>
    <p>Lorem ipsum dolor sit amet, <code>consectetur adipiscing elit, sed</code> do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <blockquote>
      Yo this is a fucken quote.
    </blockquote>
    <div className="h4">Lorem ipsum dolor sit amet</div>
    <p>Lorem ipsum dolor sit amet, <code>consectetur adipiscing elit, sed</code> do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <pre><code>
      <pre><code>
        {codeString}
      </code></pre>
    </code></pre>
    <div className="h2">Lorem ipsum dolor sit amet</div>
    <div className="h3">Lorem ipsum dolor sit amet</div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut <a href="#">labore et dolore</a> magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco <a href="#">laboris nisi ut aliquip</a> ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    {/* tslint:enable */}
  </div>
</div>;
