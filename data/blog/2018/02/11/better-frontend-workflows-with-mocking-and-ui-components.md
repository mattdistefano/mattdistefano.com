---
created: February 11, 2018
summary: A couple practices to help improve frontend development workflows.
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

## Mock logic and state

A very basic implementation of a mock would have it immediately return a hard-coded response on every call. This can be useful for some types of APIs, but typically we expect that:

1) The mock will add a random delay before responding, so as to simulate network latency and processing time.
2) The mock will have some way to trigger any error responses.
3) The mock will have some way to trigger any conditional success responses.
4) When mocking a full CRUD API, our CUD operations are reflected in R operations.

The details of implementing all of this will depend a lot on the project's overall technology stack and architecture. If we have specific data access services, we can swap in a mock implementation through DI  config, or just overwrite methods on the original object (this works with `$.ajax` and `window.fetch` too). Some frameworks --- Angular, for example --- have built-in support for mocking backend APIs. We may even choose to run a "real" server in a separate process and make actual network requests.

## Dangers of mocking

Of course, there's some risks involved.

First, without a strict data contract, it can be easy to find your mock implementation of an API varies from the real one.

Second, while mocking enables simulation of API errors, it's not very good for simulating browser errors. For example, you may still run into CORS, CSP, etc errors once you're making a real network request.

Third, creating and maintaining mocks can add some overhead to the project.

## Using container and UI components

Let's assume that, in the login example above, we need to spend some time fine-tuning the UI. Maybe we need to animate the entry of certain error messages, or perhaps we're inserting some dynamic content into the error messages and want to experiment with a variety of content lengths. Ideally, much of this would be baked into our standard component library, but let's assume we need to do *something* that requires exercising all the different states and functionality of the UI.

Again, it's easy to see where we'd have problems using a real remote login API. Using a mock API solves many of those problems, but let's take a step back here and ask: from a user interface standpoint, do we even care that there's an API involved? After all, our user isn't interacting with an API --- they're interacting with our form. And, if we think about it, if our form has a hard dependency a specific remote API, aren't we mixing concerns and creating tight couplings that might hurt us down the road?

So let's separate our concerns a bit.

Just looking over our requirements, we can see that our form can be in a couple different states. There's a resting state, a loading state, and a variety of error states. Our form also has at least 1 action, that of "submitting" when the user clicks the button or hits enter. Based on this, we can easily define an interface for our form that encapsulates only the UI concerns:

```typescript
type LoginFormComponentError = 'InvalidUsername'
  |'InvalidPassword'
  |'TemporarilyLocked'
  |'PermanentlyLocked'
  |'Other';

type SubmitLoginCallback = (username: string, password: string) => void;

interface LoginFormComponent {
  /** Render new UI based on specified state */
  render: (loading: boolean, 
    error: LoginFormComponentError, 
    onSubmitLogin: SubmitLoginCallback) => void;
}
```

This example is given in TypeScript and does not reflect any particular framework's conventions. The important part isn't the actual declaration of an interface in code, it's that we've modeled a *conceptual* interface for our login form as UI component that is decoupled from the application logic of actually logging in to anything. We need not be using TypeScript at all; we don't even need to be using a component-based framework (though it helps).

Let's compare what has changed.

Remember, our original sequence looked something like this:

```
@startuml

actor User
participant Form
participant "JS Data" as Data
participant "Dev API" as DevAPI
participant "Dev User Store" as DevUserStore

User->Form: click login
Form-->User: loading screen
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

In some psuedocode:

```typescript
class Form {
  private loading = false;
  private error = null;

  constructor(private data: any) { }

  private parseError(err) {
    // do something here to map the error to a LoginFormComponentError
    return '';
  }

  render() {
    // do something to manipulate the DOM
  }

  submit() {
    this.loading = true;
    this.error = null;
    this.render();

    this.data
      .login({ username, password })
      .then(
        () => { /* redirect */ },
        err => {
          this.loading = true;
          this.error = parseError(err);
          this.render();
        }
      );
  }
}
```

In this implementation, with a single form component, clicking the 'login' button immediately fired off an async call to the login API, and the loading/error states were hard-bound to the lifecycle of that async call. 

In our new implementation, we've separated our concerns:

```
@startuml

actor User
participant "Login Form UI Component" as Form
participant "Login Form Container Component" as Container
participant "JS Data" as Data
participant "Dev API" as DevAPI
participant "Dev User Store" as DevUserStore

User->Form: click login
Form->Container: onLoginSubmit({username, password})
Container->Form: render({ error: null, loading: true})
Form-->User: loading screen
Container->Data: login
Data->DevAPI: POST {username, password} /remote/api/login
DevAPI->DevUserStore: attempt login
DevUserStore-->DevAPI: response
DevAPI-->Data: response
Data-->Container: response
Container->Container: parse response
alt 20x (success)
  Container-->User: redirect
else 4xx/5xx (failure)
  Container->Form: render({ error: error, loading: false})
  Form-->User: error screen
end
@enduml
```

And again, some psuedocode:

```typescript
class FormContainerComponent {
  private loading = false;
  private error = null;

  constructor(private data: any, private uiComponent: LoginFormComponent) { }

  private parseError(err) {
    // do something here to map the error to a LoginFormComponentError
    return '';
  }

  login(username: string, password: string) {
    this.loading = true;
    this.error = null;
    this.render();

    this.data
      .login({ username, password })
      .then(
        () => { /* redirect */ }, 
        err => {
          this.loading = false;
          this.error = parseError(err);
          this.render();
        }
      );
  }

  render() {
    this.uiComponent.render(this.loading, this.error, this.login);
  }
}

class FormUIComponent implements LoginFormComponent {
  render(loading: boolean, error: LoginFormComponentError, onSubmitLogin: SubmitLoginCallback) {
    // do something to manipulate the DOM and call onSubmitLogin when the login form is submitted
  }
}
```

Now, the application logic necessary to actually log in (making the API call, parsing the response, catching errors), and the associated state, is managed by a container. The container doesn't directly handle any user input or render any user interface; rather, it delegates those concerns to the UI component, which is responsible for rendering the appropriate user interface based on the `loading` and `error` state and raising the `onSubmitLogin` when the user clicks the 'login' button. (Note that, in most contemporary frameworks, the container would be another component, but it could also be a route, controller, page, etc; the key point here is the division of responsibilities.)

By separating these concerns, we've opened up some interesting avenues for development:

- We can develop the UI component inside a mock container on any page that is convenient, rather than having to work on it where it would appear in our real-life application. For a login screen, this may be a meaningless distinction, but for screens buried inside an authenticated workflow, being able to develop outside of that workflow can be a major time-saver.
- If we want to test the whole lifecycle of the UI component, we can easily make the mock container that handles `onSubmit` and manipulates `loading` and `error`.
- If we want to fine-tune a particular state of the UI component, can default the mock container to that state.
- If we want to validate all states of the UI component, we can place multiple instances - one for each possible state --- in the mock container and review them side by side. We can even create a living storyboard showing an entire workflow through multiple states or multiple components.
- If we want to unit test the UI component, we need only a simple test fixture that satisfies its interface (vs. mocking an entire API dependency). Likewise, if we want to unit test the container component, we can do so without needing to worry about any UI.
- If we want to split up development of the login 'feature', we can task one developer with building the container and another with building the UI component. 
- If we need a login form elsewhere in the application that hits a different API, we can reuse our UI component as-is with a new container. Likewise, if we want to change the UI, we need only change the UI component --- the container can remain unchanged.
- We can even package and distribute our UI component for reuse in multiple projects.

An example mock container to simulate all the error and loading states might look like this:

```typescript
const errorTypes = ['InvalidUsername','InvalidPassword','TemporarilyLocked','PermanentlyLocked','Other'];

class MockFormContainerComponent {
  private loading = false;
  private error = null;

  constructor(private uiComponent: LoginFormComponent) { }

  login(username: string, password: string) {
    this.loading = true;
    this.error = null;
    this.render();

    setTimeout(() => {
      if (errorTypes.contains(username)) {
        this.error = userName;
      }
      this.loading = false;
      this.render();
    }, Math.random() * 3000);
  }

  render() {
    this.uiComponent.render(this.loading, this.error, this.login);
  }
}
```