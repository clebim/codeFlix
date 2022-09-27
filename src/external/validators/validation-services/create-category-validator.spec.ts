import faker from 'faker';

import { CreateCategoryValidator } from './create-category-validator';

describe('Test Create Category Validator', () => {
  let createCategoryValidator: CreateCategoryValidator;

  beforeEach(() => {
    createCategoryValidator = new CreateCategoryValidator();
  });

  test('Should call validate with success', async () => {
    const mockRequest = {
      name: faker.datatype.string(),
      description: faker.datatype.string(64),
    };

    const { isValid, invalidFields, value } =
      createCategoryValidator.validate(mockRequest);

    expect(isValid).toBeTruthy();
    expect(invalidFields).toBeUndefined();
    expect(value).toEqual({
      ...mockRequest,
    });
  });

  test('Should call validate and get invalid fields', async () => {
    const mockRequest = {
      name: faker.datatype.string(280),
      description: faker.datatype.string(64),
    };

    const { isValid, invalidFields, value } =
      createCategoryValidator.validate(mockRequest);

    expect(isValid).toBeFalsy();
    expect(invalidFields).toEqual({
      name: 'name length must be less than or equal to 256 characters long',
    });
    expect(value).toBeUndefined();
  });
});
