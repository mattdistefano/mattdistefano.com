export class HttpError extends Error {
  constructor(message: string, public code?: number, public text?: string) {
    super(message);

    // Set the prototype explicitly.
    // tslint:disable-next-line
    // see https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
