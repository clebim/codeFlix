import faker from 'faker';

import { UpdateCategoryValidator } from './update-category-validator';

describe('Test Update Category Validator', () => {
  let updateCategoraValidator: UpdateCategoryValidator;

  beforeEach(() => {
    updateCategoraValidator = new UpdateCategoryValidator();
  });

  test('Should call validate with success', async () => {
    const mockRequest = {
      id: faker.datatype.uuid(),
      name: faker.datatype.string(64),
      isActive: true,
    };

    const { isValid, invalidFields, value } =
      updateCategoraValidator.validate(mockRequest);

    expect(isValid).toBeTruthy();
    expect(invalidFields).toBeUndefined();
    expect(value).toEqual({
      ...mockRequest,
    });
  });

  test('Should call validate and get invalid fields', async () => {
    const mockRequest = {
      name: '',
      description: faker.datatype.string(),
      isActive: faker.datatype.string(),
    } as any;

    const { isValid, invalidFields, value } =
      updateCategoraValidator.validate(mockRequest);

    expect(isValid).toBeFalsy();
    expect(invalidFields).toEqual({
      name: 'name is not allowed to be empty',
      id: 'id is required',
      isActive: 'isActive must be a boolean',
    });
    expect(value).toBeUndefined();
  });
});
