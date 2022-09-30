import { Controller } from '@adapters/controllers';
import {
  ContainerVersion,
  injectionFactory,
} from '@external/dependency-injection/factory';
import { ApolloError } from 'apollo-server-express';

export class Resolver {
  protected containerVersion = ContainerVersion;

  protected injectionTokens = {
    listCategoryController: 'ListCategoryController',
  };

  protected getController(injectionToken: string, version: number): Controller {
    return injectionFactory(injectionToken, version);
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
    throw new ApolloError(message, 'VALIDATION-ERROR');
  }

  private serverError(message: string) {
    throw new ApolloError(message, 'INTERNAL-SERVER-ERROR');
  }
}
