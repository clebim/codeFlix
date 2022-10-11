import faker from 'faker';

import { CreateUserValidator } from './create-user-validator';

describe('Test Create user Validator', () => {
  let createCategoryValidator: CreateUserValidator;

  beforeEach(() => {
    createCategoryValidator = new CreateUserValidator();
  });

  test('Should call validate with success', async () => {
    const mockRequest = {
      name: faker.datatype.string(),
      email: faker.internet.email(),
      password: '@Teste123',
      passwordConfirmation: '@Teste123',
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
      name: faker.datatype.string(),
      email: faker.datatype.string(64),
      password: 'teste',
      passwordConfirmation: 'tesste',
    };

    const { isValid, invalidFields, value } =
      createCategoryValidator.validate(mockRequest);

    expect(isValid).toBeFalsy();
    expect(invalidFields).toEqual({
      email: 'email must be a valid email',
      password:
        'Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length',
      passwordConfirmation: 'passwordConfirmation does not match',
    });
    expect(value).toBeUndefined();
  });
});
