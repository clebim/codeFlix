/* eslint-disable no-useless-catch */
import {
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@usecases/category/create-category-use-case';
import { CategoryAlreadyExistsError } from '@usecases/errors/category/category-already-exists-error';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UseCase } from '@usecases/port/use-case';
import { inject, injectable } from 'tsyringe';

import { Controller } from '..';

import { HttpRequest } from '../port/http-request';
import { HttpResponse } from '../port/http-response';

@injectable()
export class CreateCategoryController extends Controller {
  constructor(
    @inject('CreateCategoryUseCase')
    private useCase: UseCase<CreateCategoryRequest, CreateCategoryResponse>,
  ) {
    super();
  }

  public async handle(
    httpRequest: HttpRequest<CreateCategoryRequest>,
  ): Promise<HttpResponse> {
    try {
      const { isFailure, error, data } = await this.useCase.execute(
        httpRequest.body,
      );

      if (isFailure && error instanceof InvalidDataError) {
        return this.unprocessableEntity(error);
      }

      if (isFailure && error instanceof CategoryAlreadyExistsError) {
        return this.conflict(error);
      }

      return this.created(data);
    } catch (error) {
      return this.serverError('Internal server error');
    }
  }
}
