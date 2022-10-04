import {
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from '@usecases/category/update-category-use-case';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { NotFoundError } from '@usecases/errors/not-found-error';
import { UseCase } from '@usecases/port/use-case';
import { inject, injectable } from 'tsyringe';

import { Controller } from '../index';
import { HttpRequest } from '../port/http-request';
import { HttpResponse } from '../port/http-response';

@injectable()
export class UpdateCategoryController extends Controller {
  constructor(
    @inject('UpdateCategoryUseCase')
    private useCase: UseCase<UpdateCategoryRequest, UpdateCategoryResponse>,
  ) {
    super();
  }

  public async handle(
    httpRequest: HttpRequest<
      Omit<UpdateCategoryRequest, 'id'>,
      any,
      { id: string }
    >,
  ): Promise<HttpResponse> {
    try {
      const { isFailure, error, data } = await this.useCase.execute({
        id: httpRequest.params.id,
        ...httpRequest.body,
      });

      if (isFailure && error instanceof InvalidDataError) {
        return this.unprocessableEntity(error);
      }

      if (isFailure && error instanceof NotFoundError) {
        return this.notFound(error);
      }

      return this.ok(data);
    } catch (error) {
      return this.serverError('Internal server error');
    }
  }
}
