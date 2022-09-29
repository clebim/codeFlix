import { CreateCategoryRequest } from '@usecases/category/create-category-use-case';
import { RequestValidator } from '@usecases/port/request-validator';
import { ValidatorResult } from '@usecases/port/validator-result';
import Joi from 'joi';

import { HapiValidator } from '../../hapi-request-validator';

export class CreateCategoryValidator
  extends HapiValidator<CreateCategoryRequest>
  implements RequestValidator<CreateCategoryRequest>
{
  constructor() {
    const requestSchema = Joi.object<CreateCategoryRequest>({
      name: Joi.string().required().max(256),
      description: Joi.string().optional(),
    }).required();

    super(requestSchema);
  }

  public validate(
    request: CreateCategoryRequest,
  ): ValidatorResult<CreateCategoryRequest> {
    return super.validate(request);
  }
}
