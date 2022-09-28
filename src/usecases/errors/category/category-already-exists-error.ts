export class CategoryAlreadyExistsError extends Error {
  public code: string;

  constructor(message?: string) {
    super(message ?? 'Category already exists in api');
    this.name = 'CategoryAlreadyExists';
    this.code = 'CATEGORY-000';
  }
}
