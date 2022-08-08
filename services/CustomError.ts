export class CustomError extends Error {
  constructor(message: string, statusCode: number) {
    super(JSON.stringify({ statusCode, message }, null, 2));
  }
}
