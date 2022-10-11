import { HapiValidator } from '@external/validators/hapi-request-validator';
import { CreateUserRequest } from '@usecases/account/create-user-use-case';
import { RequestValidator } from '@usecases/port/request-validator';
import { ValidatorResult } from '@usecases/port/validator-result';
import Joi from 'joi';

const strongPasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const messageError =
  'Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length';

export class CreateUserValidator
  extends HapiValidator<CreateUserRequest>
  implements RequestValidator<CreateUserRequest>
{
  constructor() {
    const requestSchema = Joi.object<CreateUserRequest>({
      name: Joi.string().required().max(256),
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(8)
        .regex(strongPasswordRegex)
        .messages({
          'string.min': 'Must have at least 8 characters',
          'object.regex': 'Must have at least 8 characters',
          'string.pattern.base': messageError,
        })
        .required(),
      passwordConfirmation: Joi.string()
        .equal(Joi.ref('password'))
        .options({ messages: { 'any.only': '{{#label}} does not match' } })
        .required(),
    }).required();

    super(requestSchema);
  }

  public validate(
    request: CreateUserRequest,
  ): ValidatorResult<CreateUserRequest> {
    return super.validate(request);
  }
}
