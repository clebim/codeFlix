export class InvalidDataError extends Error {
  public fields;

  constructor(fields) {
    super('Invalid data.');
    this.name = 'InvalidDataError';
    this.fields = fields;
  }
}
