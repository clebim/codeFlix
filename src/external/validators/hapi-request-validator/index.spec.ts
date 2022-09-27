import Joi, { ObjectSchema } from '@hapi/joi';

import { HapiValidator } from './index';

interface Request {
  name: string;
  age: number;
}

const requestSchema: ObjectSchema<Request> = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
}).required();

describe('Hapi request validator', () => {
  test('Should return valid if valid data when called validate', async () => {
    const hapiEntityValidator = new HapiValidator<Request>(requestSchema);
    const request: Request = {
      name: 'name',
      age: 1,
    };

    const result = hapiEntityValidator.validate(request);

    expect(result.isValid).toBe(true);
    expect(result.invalidFields).toBe(undefined);
    expect(result.value).toEqual(request);
  });

  test('Should return invalid and fields if invalid data when called validate', async () => {
    const hapiEntityValidator = new HapiValidator<Request>(requestSchema);
    const entity: Request = {
      name: '',
      age: undefined,
    };

    const result = hapiEntityValidator.validate(entity);

    expect(result.isValid).toBe(false);
    expect(result.invalidFields).toEqual({
      age: 'age is required',
      name: 'name is not allowed to be empty',
    });
    expect(result.value).toEqual(undefined);
  });
});
