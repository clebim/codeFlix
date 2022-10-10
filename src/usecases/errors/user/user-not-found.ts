export class UserNotFoundError extends Error {
  public code: string;

  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
    this.code = 'USER-NOT-FOUND';
  }
}
