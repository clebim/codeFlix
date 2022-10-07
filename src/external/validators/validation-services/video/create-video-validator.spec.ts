import { CreateVideoRequest } from '@usecases/video/create-video-use-case';
import faker from 'faker';

import { CreateVideoValidator } from './create-video-validator';

describe('Test Create Video Validator', () => {
  let createCategoryValidator: CreateVideoValidator;

  beforeEach(() => {
    createCategoryValidator = new CreateVideoValidator();
  });

  test('Should call validate with success', async () => {
    const mockRequest: CreateVideoRequest = {
      categoriesId: [faker.datatype.uuid()],
      filename: faker.datatype.string(),
      title: faker.datatype.string(),
      userId: faker.datatype.uuid(),
      public: false,
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
      categoriesId: [faker.datatype.string()],
      title: faker.datatype.number(),
      userId: faker.datatype.string(),
    };

    const { isValid, invalidFields, value } = createCategoryValidator.validate(
      mockRequest as unknown as CreateVideoRequest,
    );

    expect(isValid).toBeFalsy();
    expect(invalidFields).toEqual({
      'categoriesId.0': 'categoriesId[0] must be a valid GUID',
      filename: 'filename is required',
      title: 'title must be a string',
      userId: 'userId must be a valid GUID',
    });
    expect(value).toBeUndefined();
  });
});
