import { ListVideosRequest } from '@usecases/video/list-videos-use-case';
import faker from 'faker';

import { ListVideosValidator } from './list-videos-validator';

describe('Test List videos Validator', () => {
  let createCategoryValidator: ListVideosValidator;

  beforeEach(() => {
    createCategoryValidator = new ListVideosValidator();
  });

  test('Should call validate with success', async () => {
    const mockRequest: ListVideosRequest = {
      categories: [faker.datatype.string()],
      title: faker.datatype.string(),
      userId: faker.datatype.uuid(),
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
      categories: [faker.datatype.number()],
      title: faker.datatype.number(),
      userId: faker.datatype.string(),
    };

    const { isValid, invalidFields, value } = createCategoryValidator.validate(
      mockRequest as unknown as ListVideosRequest,
    );

    expect(isValid).toBeFalsy();
    expect(invalidFields).toEqual({
      'categories.0': 'categories[0] must be a string',
      title: 'title must be a string',
      userId: 'userId must be a valid GUID',
    });
    expect(value).toBeUndefined();
  });
});
