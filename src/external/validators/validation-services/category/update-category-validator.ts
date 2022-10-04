import { HapiValidator } from '@external/validators/hapi-request-validator';
import { UpdateCategoryRequest } from '@usecases/category/update-category-use-case';
import { RequestValidator } from '@usecases/port/request-validator';
import { ValidatorResult } from '@usecases/port/validator-result';
import Joi from 'joi';

export class UpdateCategoryValidator
  extends HapiValidator<UpdateCategoryRequest>
  implements RequestValidator<UpdateCategoryRequest>
{
  constructor() {
    const requestSchema = Joi.object<UpdateCategoryRequest>({
      id: Joi.string().uuid().required(),
      name: Joi.string().optional().max(256),
      description: Joi.string().optional(),
      isActive: Joi.boolean().optional(),
    }).required();

    super(requestSchema);
  }

  public validate(
    request: UpdateCategoryRequest,
  ): ValidatorResult<UpdateCategoryRequest> {
    return super.validate(request);
  }
}
