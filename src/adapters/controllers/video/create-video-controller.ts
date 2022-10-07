import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UseCase } from '@usecases/port/use-case';
import {
  CreateVideoRequest,
  CreateVideoResponse,
} from '@usecases/video/create-video-use-case';
import { inject, injectable } from 'tsyringe';

import { generateUniqueId } from '@shared/domain/unique-entity-id';

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
      const { categoriesId } = httpRequest.body;
      const request = {
        categoriesId: Array.isArray(categoriesId)
          ? categoriesId
          : [categoriesId],
        title: httpRequest.body.title,
        userId: generateUniqueId(),
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
