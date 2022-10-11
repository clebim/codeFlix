export class UserAlreadyExistsError extends Error {
  public code: string;

  constructor(message: string) {
    super(message);
    this.name = 'UserAlreadyExistsError';
    this.code = 'USER-ALREADY-EXISTS';
  }
}
