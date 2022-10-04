export class NotFoundError extends Error {
  public code: string;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.code = 'NOT-FOUND';
  }
}
