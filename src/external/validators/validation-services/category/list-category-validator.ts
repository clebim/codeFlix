import { HapiValidator } from '@external/validators/hapi-request-validator';
import { ListCategoryRequest } from '@usecases/category/list-category-use-case';
import { RequestValidator } from '@usecases/port/request-validator';
import { ValidatorResult } from '@usecases/port/validator-result';
import Joi from 'joi';

export class ListCategoryValidator
  extends HapiValidator<ListCategoryRequest>
  implements RequestValidator<ListCategoryRequest>
{
  constructor() {
    const requestSchema = Joi.object<ListCategoryRequest>({
      name: Joi.string().optional().max(256),
      description: Joi.string().optional(),
      createdAt: Joi.date().iso().less('now').optional(),
      id: Joi.alternatives().try(
        Joi.array().items(Joi.string().uuid()),
        Joi.string().uuid(),
      ),
    }).required();

    super(requestSchema);
  }

  public validate(
    request: ListCategoryRequest,
  ): ValidatorResult<ListCategoryRequest> {
    return super.validate(request);
  }
}
