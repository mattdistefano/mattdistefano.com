export class HttpError extends Error {
  constructor(message: string, public code?: number, public text?: string) {
    super(message);
  }
}
