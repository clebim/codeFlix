import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UseCase } from '@usecases/port/use-case';
import {
  CreateVideoRequest,
  CreateVideoResponse,
} from '@usecases/video/create-video-use-case';
import { inject, injectable } from 'tsyringe';

import { Controller } from '../index';
import { HttpRequest } from '../port/http-request';
import { HttpResponse } from '../port/http-response';

@injectable()
export class CreateVideoController extends Controller {
  constructor(
    @inject('CreateVideoUseCase')
    private useCase: UseCase<CreateVideoRequest, CreateVideoResponse>,
  ) {
    super();
  }

  public async handle(
    httpRequest: HttpRequest<Omit<CreateVideoRequest, 'filename'>>,
  ): Promise<HttpResponse> {
    try {
      const request = {
        categoriesId: httpRequest.body.categoriesId,
        title: httpRequest.body.title,
        userId: '37e2aaaf-5998-42f6-9c10-6459e15692b3',
        description: httpRequest.body.description,
        public: httpRequest.body.public,
      } as CreateVideoRequest;

      if (httpRequest.file) {
        const { filename, fieldname } = httpRequest.file;
        request.filename = fieldname === 'video' ? filename : '';
      }

      if (httpRequest.files) {
        request.thumbnail = httpRequest.files.find(
          file => file.fieldname === 'thumbnail',
        ).filename;
        request.filename = httpRequest.files.find(
          file => file.fieldname === 'video',
        ).filename;
      }

      const { isFailure, error, data } = await this.useCase.execute(request);

      if (isFailure && error instanceof InvalidDataError) {
        return this.unprocessableEntity(error);
      }

      return this.created(data);
    } catch (error) {
      return this.serverError('Internal server error');
    }
  }
}
