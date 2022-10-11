import {
  CreateUserRequest,
  CreateUserResponse,
} from '@usecases/account/create-user-use-case';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UserAlreadyExistsError } from '@usecases/errors/user/user-already-exists-error';
import { UseCase } from '@usecases/port/use-case';
import { inject, injectable } from 'tsyringe';

import { Controller } from '../index';
import { HttpRequest } from '../port/http-request';
import { HttpResponse } from '../port/http-response';

@injectable()
export class CreateUserController extends Controller {
  constructor(
    @inject('CreateUserUseCase')
    private useCase: UseCase<CreateUserRequest, CreateUserResponse>,
  ) {
    super();
  }

  async handle(
    httpRequest: HttpRequest<CreateUserRequest>,
  ): Promise<HttpResponse> {
    try {
      const { isFailure, error, data } = await this.useCase.execute(
        httpRequest.body,
      );

      if (isFailure && error instanceof InvalidDataError) {
        return this.unprocessableEntity(error);
      }

      if (isFailure && error instanceof UserAlreadyExistsError) {
        return this.conflict(error);
      }

      return this.created(data);
    } catch (error) {
      return this.serverError('Internal server error');
    }
  }
}
