import { HapiValidator } from '@external/validators/hapi-request-validator';
import { RequestValidator } from '@usecases/port/request-validator';
import { ValidatorResult } from '@usecases/port/validator-result';
import { CreateVideoRequest } from '@usecases/video/create-video-use-case';
import Joi from 'joi';

export class CreateVideoValidator
  extends HapiValidator<CreateVideoRequest>
  implements RequestValidator<CreateVideoRequest>
{
  constructor() {
    const requestSchema = Joi.object<CreateVideoRequest>({
      userId: Joi.string().uuid().required(),
      categoriesId: Joi.alternatives()
        .try(Joi.array().items(Joi.string().uuid()), Joi.string().uuid())
        .optional(),
      filename: Joi.string().required(),
      public: Joi.boolean().optional(),
      thumbnail: Joi.string().optional(),
      title: Joi.string().required(),
      description: Joi.string().optional(),
    }).required();

    super(requestSchema);
  }

  public validate(
    request: CreateVideoRequest,
  ): ValidatorResult<CreateVideoRequest> {
    return super.validate(request);
  }
}
