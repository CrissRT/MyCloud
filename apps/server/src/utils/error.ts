export class ValidationError extends Error {
  public fields: string[];

  constructor(fields: string[]) {
    super(`Missing required field${fields.length > 1 && 's'}: ${fields.join(', ')}`);
    this.fields = fields;
    this.name = 'ValidationError';
  }
}
