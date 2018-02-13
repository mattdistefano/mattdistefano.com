---
created: February 11, 2018
summary: Decoupling code to decouple our workflows
---

# Better frontend workflows with mocking and UI components

Let's think about a simple login form. Our requirements are: that the form should show a username and password input along with a 'login' button; that when the login button is clicked, the entered username and password are POSTed to the login API asynchronously; and that, while this is happening, a loading spinner is displayed.

Additionally, if the login fails, a failure-specific error message should be displayed. We expect we'll need to handle the following types of failures:

- Invalid username.
- Valid username, but invalid password.
- Valid username, but temporarily locked.
- Valid username, but permanently locked.
- Server is down or other 500-ish error.

## Simple, right? 

There's not a lot happening here --- we can just throw a bit of HTML on the page and do a AJAX POST to our login API. Our application flow would look something like this:

```
@startuml

actor User
participant Form
participant "JS Data" as Data
participant "Dev API" as DevAPI
participant "Dev User Store" as DevUserStore

User->Form: click login
Form->Data: login
Data->DevAPI: POST {username, password} /remote/api/login
DevAPI->DevUserStore: attempt login
DevUserStore-->DevAPI: response
DevAPI-->Data: response
Data-->Form: response
alt 20x (success)
  Form-->User: redirect
else 4xx/5xx (failure)
  Form-->User: error screen
end
@enduml
```

(Assume that `Data` is any JS data API - `$.ajax`, `window.fetch`, a framework-specific service, etc).

Of course, we can already see where we might get tripped up trying to work directly with the API. What if the dev server hosting the login API goes down all day for an upgrade? What if we don't have a test account that's in a "permanently locked" state, or don't have access to remove a temporary lock? What if the API developers haven't implemented the temporary lock yet? And how *do* we induce a 500-error in this API?

## Working off a mock instead

This is where mocking comes in. Instead of making calls to a real API sitting on a remote server, we can run a fake API locally --- either in a separate process or in-memory in the browser --- and reroute our calls to it. This allows us to tailor the timing and content of the responses to meet our development needs, and doesn't put us at the mercy of system downtime.

Let's assume we're working off an in-memory mock. Now, our application flow during development looks more like this:

```
@startuml

actor User
participant Form
participant "mock of Data" as MockData

User->Form: click login
Form->MockData: login
MockData->Form: response
alt success
  Form-->User: redirect
else failure
  Form-->User: error screen
end
@enduml
```

Because the `MockData` code lives in ourcodebase, we can easily build logic into it to simulate just about everything we expect from the real-world login API, without having to wait for that API to be built or stabilized. 

### What do we expect from a mock?

A very basic implementation of a mock might have it immediately return a hard-coded response on every call. This can be useful for some types of APIs, but typically we expect that:

1) The mock will add a random delay before responding, so as to simulate network latency and processing time.
2) The mock will have some way to trigger error responses.
3) The mock will have some way to trigger conditional success responses.
4) When mocking a full CRUD API, our CUD operations are reflected in R operations.
5) The mock can be activated for development and excluded from production builds.

The details of implementing all of this will depend a lot on the project's overall technology stack and architecture. If we have specific data access services, we can swap in a mock implementation through DI  config, or just overwrite methods on the original object (this works with `$.ajax` and `window.fetch` too). Some frameworks --- Angular, for example --- have built-in support for mocking backend APIs. We may even choose to run a "real" server in a separate process and make actual network requests.

### What does mocking gain us?

Working off a mock during development ensures that:

- Our frontend work doesn't get held up by downtime in a remote API.
- We can exercise all the edge cases and error conditions that might be difficult to produce reliably in a real API running on a remote server.
- Frontend and backend teams can develop in parallel off an agreed-upon data contract.

### Dangers of mocking

Of course, there's some risks involved:

- Without a strict data contract, it can be easy to find your mock implementation of an API varies from the real one.
- While mocking enables simulation of API errors, it's not very good for simulating browser errors. For example, you may still run into CORS, CSP, etc errors once you're making a real network request.
- Creating and maintaining mocks can add some overhead to the project.

## Using container and UI components

Let's assume that, in the login example above, we need to spend some time fine-tuning the UI. Maybe we need to animate the entry of certain error messages, or perhaps we're inserting some dynamic content into the error messages and want to experiment with a variety of content lengths. Ideally, much of this would be baked into our standard component library, but let's assume we need to do *something* that requires exercising all the different states and functionality of the UI. Again, it's easy to see where we'd have problems using a real remote login API, so let's assume we're using a mock API.

We might have something like this:

```typescript
import * as React from 'react';

/** Our mock data service. */
export class DataService {
  private errorTypes = [
    'InvalidUsername',
    'InvalidPassword',
    'TemporarilyLocked',
    'PermanentlyLocked',
    'Other'
  ];

  login(credentials: { username: string; password: string }) {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (this.errorTypes.indexOf(credentials.username) !== -1) {
          return reject(credentials.username);
        }
        resolve({});
      }, Math.random() * 3000)
    );
  }
}

/* String union type containing all possible login error codes */
export type LoginError = 'InvalidUsername'
  |'InvalidPassword'
  |'TemporarilyLocked'
  |'PermanentlyLocked'
  | 'Other';

/* Login component props */
export interface LoginProps {}

/** Login component state */
export interface LoginState {
  username: string;
  password: string;
  loading: boolean;
  error: LoginError;
}

/** Login component */
export class LoginComponent extends React.Component<LoginProps, LoginState> {
  /* 
   * In a real-world app, we'd expect this to be injected in some manner.
   * For the purpose of this example, we're hard-coding it.
   */
  private _dataService = new DataService();

  constructor(props: LoginProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loading: false,
      error: null
    };

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /** Event handler for login form submit */
  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true, error: null });

    this._dataService
      .login({ username: this.state.username, password: this.state.password })
      .then(
        () => this.setState({ loading: false, error: null }),
        (err: LoginError) => this.setState({ loading: true, error: err })
      );
  }

  /** Event handler for username field change */
  onUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value, error: null });
  }

  /** Event handler for password field change */
  onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value, error: null });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {this.state.error && <div>{this.state.error}</div>}
        <label>
          Username
          <input
            type="text"
            value={this.state.username}
            readOnly={this.state.loading}
            onChange={this.onUsernameChange}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={this.state.password}
            readOnly={this.state.loading}
            onChange={this.onPasswordChange}
          />
        </label>
        <button type="submit">
          {this.state.loading ? 'Loading' : 'Login'}
        </button>
      </form>
    );
  }
}
```

The mock API makes development much simpler, but let's take a step back here and ask: from a user interface standpoint, do we even care that there's an API involved? After all, our user isn't interacting with an API --- they're interacting with our form. 

So let's separate our concerns a bit.

```typescript
/* Login form component props */
export interface LoginFormProps {
  loading: boolean;
  error: LoginError;
  onSubmit: (credentials: { username: string; password: string }) => void;
}

/** Login form component state */
export interface LoginFormState extends Credentials {}

/** Login form component */
export class LoginFormComponent extends React.Component<
  LoginFormProps,
  LoginFormState
> {
  constructor(props: LoginFormProps) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /** Event handler for login form submit */
  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    this.props.onSubmit({
      username: this.state.username,
      password: this.state.password
    });
  }

  /** Event handler for username field change */
  onUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value });
  }

  /** Event handler for password field change */
  onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {this.props.error && <div>{this.props.error}</div>}
        <label>
          Username
          <input
            type="text"
            value={this.state.username}
            readOnly={this.props.loading}
            onChange={this.onUsernameChange}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={this.state.password}
            readOnly={this.props.loading}
            onChange={this.onPasswordChange}
          />
        </label>
        <button type="submit">
          {this.props.loading ? 'Loading' : 'Login'}
        </button>
      </form>
    );
  }
}

/* Login container component props */
export interface LoginContainerProps {}

/** Login container component state */
export interface LoginContainerState {
  loading: boolean;
  error: LoginError;
}

/** Login container component */
export class LoginContainerComponent extends React.Component<
  LoginContainerProps,
  LoginContainerState
> {
  /* 
   * In a real-world app, we'd expect this to be injected in some manner.
   * For the purpose of this example, we're hard-coding it.
   */
  private _dataService = new DataService();

  constructor(props: LoginProps) {
    super(props);

    this.state = {
      loading: false,
      error: null
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  /** Event handler for login form submit */
  onSubmit(credentials: Credentials) {
    event.preventDefault();

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true, error: null });

    this._dataService
      .login(credentials)
      .then(
        () => this.setState({ loading: false, error: null }),
        (err: LoginError) => this.setState({ loading: true, error: err })
      );
  }

  render() {
    return <LoginFormComponent onSubmit={this.onSubmit} {...this.state} />;
  }
}
```

Let's compare what has changed.

In our original implementation with a single form component, clicking the 'login' button immediately fired off an async call to the login API, and the loading/error states were hard-bound to the lifecycle of that async call. 

In our new implementation, the application logic necessary to actually log in (making the API call, parsing the response, catching errors), and the associated state, is managed by a container. The container doesn't directly handle any user input or render any user interface; rather, it delegates those concerns to the UI component, which is responsible for rendering the appropriate user interface based on the `loading` and `error` state and invoking the `onSubmit` callback when the user clicks the 'login' button. 

By separating these concerns, we've opened up some interesting avenues for development:

- We can develop the UI component inside a mock container on any page that is convenient, rather than having to work on it where it would appear in our real-life application. For a login screen, this may be a meaningless distinction, but for screens buried inside an authenticated workflow, being able to develop outside of that workflow can be a major time-saver.
- Instead of mocking success/failure at the API level, we can implement it within our mock container.
- If we want to fine-tune a particular state of the UI component, can default the mock container to that state.
- If we want to validate all states of the UI component, we can place multiple instances - one for each possible state --- in the mock container and review them side by side. We can even create a living storyboard showing an entire workflow through multiple states or multiple components.
- If we want to unit test the UI component, we need only a simple test fixture that satisfies its interface (vs. mocking an entire API dependency). Likewise, if we want to unit test the container component, we can do so without needing to worry about any UI.
- If we want to split up development of the login 'feature', we can task one developer with building the container and another with building the UI component. 
- If we need a login form elsewhere in the application that hits a different API, we can reuse our UI component as-is with a new container. Likewise, if we want to change the UI, we need only change the UI component --- the container can remain unchanged.
- We can even package and distribute our UI component for reuse in multiple projects.

An example mock container to simulate all the error and loading states might look like this:

```typescript

/** Mock login container component */
export class MockLoginContainerComponent extends React.Component<
  LoginContainerProps,
  LoginContainerState
  > {
  private errorTypes = [
    'InvalidUsername',
    'InvalidPassword',
    'TemporarilyLocked',
    'PermanentlyLocked',
    'Other'
  ];

  constructor(props: LoginProps) {
    super(props);

    this.state = {
      loading: false,
      error: null
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  /** Event handler for login form submit */
  onSubmit(credentials: Credentials) {
    event.preventDefault();

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true, error: null });

    setTimeout(() => {
      if (this.errorTypes.indexOf(credentials.username) !== -1) {
        return this.setState({ loading: false, error: credentials.username as LoginError })
      }
      this.setState({ loading: false, error: null });
    }, Math.random() * 3000)
  }

  render() {
    return <LoginFormComponent onSubmit={this.onSubmit} {...this.state} />;
  }
}
```

These examples are given in React and TypeScript, but the concepts are applicable to other technologies. 