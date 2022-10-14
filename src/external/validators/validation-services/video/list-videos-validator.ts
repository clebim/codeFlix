import { HapiValidator } from '@external/validators/hapi-request-validator';
import { RequestValidator } from '@usecases/port/request-validator';
import { ValidatorResult } from '@usecases/port/validator-result';
import { ListVideosRequest } from '@usecases/video/list-videos-use-case';
import Joi from 'joi';

export class ListVideosValidator
  extends HapiValidator<ListVideosRequest>
  implements RequestValidator<ListVideosRequest>
{
  constructor() {
    const requestSchema = Joi.object<ListVideosRequest>({
      categories: Joi.array().items(Joi.string()).optional(),
      finalDate: Joi.date().iso().optional(),
      initialDate: Joi.date().iso().optional(),
      order: Joi.string().valid('ASC', 'DESC').optional(),
      orderBy: Joi.string().optional(),
      page: Joi.number().optional(),
      title: Joi.string().optional(),
      totalItemsPerPage: Joi.number().valid(5, 10, 15, 20, 30).optional(),
      userId: Joi.string().uuid().optional(),
    }).required();

    super(requestSchema);
  }

  public validate(
    request: ListVideosRequest,
  ): ValidatorResult<ListVideosRequest> {
    return super.validate(request);
  }
}
