import { Controller } from '@adapters/controllers';
import {
  ContainerVersion,
  injectionFactory,
} from '@external/dependency-injection/factory';
import { ApolloError } from 'apollo-server-express';

export class Resolver {
  private containerVersion = ContainerVersion;

  protected injectionTokens = {
    listCategoryController: 'ListCategoryController',
    createCategoryController: 'CreateCategoryController',
    updateCategoryController: 'UpdateCategoryController',
    createUserController: 'CreateUserController',
  };

  protected getControllerV1(injectionToken: string): Controller {
    return injectionFactory(injectionToken, this.containerVersion.V1);
  }

  private errors = {
    422: this.unprocessableEntity,
    409: this.conflict,
    404: this.notFound,
    500: this.serverError,
  };

  protected buildError(statusCode: number, message: string) {
    this.errors[statusCode](message);
  }

  private notFound(message: string) {
    throw new ApolloError(message, 'NOT-FOUND');
  }

  private conflict(message: string) {
    throw new ApolloError(message, 'CONFLICT');
  }

  private unprocessableEntity(message: string) {
    const toArrayValues: string[] = Object.values(JSON.parse(message));

    throw new ApolloError(toArrayValues.toString(), 'VALIDATION-ERROR');
  }

  private serverError(message: string) {
    throw new ApolloError(message, 'INTERNAL-SERVER-ERROR');
  }
}
