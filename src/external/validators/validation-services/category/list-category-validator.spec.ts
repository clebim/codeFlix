import faker from 'faker';

import { ListCategoryValidator } from './list-category-validator';

describe('Test Create Category Validator', () => {
  let listCategoryValidator: ListCategoryValidator;

  beforeEach(() => {
    listCategoryValidator = new ListCategoryValidator();
  });

  test('Should call validate with success', async () => {
    const mockRequest = {
      name: faker.datatype.string(),
      description: faker.datatype.string(64),
    };

    const { isValid, invalidFields, value } =
      listCategoryValidator.validate(mockRequest);

    expect(isValid).toBeTruthy();
    expect(invalidFields).toBeUndefined();
    expect(value).toEqual({
      ...mockRequest,
    });
  });

  test('Should call validate and get invalid fields', async () => {
    const mockRequest = {
      name: '',
      description: undefined,
    };

    const { isValid, invalidFields, value } =
      listCategoryValidator.validate(mockRequest);

    expect(isValid).toBeFalsy();
    expect(invalidFields).toEqual({
      name: 'name is not allowed to be empty',
    });
    expect(value).toBeUndefined();
  });
});
