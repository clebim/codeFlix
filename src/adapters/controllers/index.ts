import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { IncomingHttpHeaders } from 'http';

import { HttpRequest } from './port/http-request';
import { HttpResponse } from './port/http-response';

export abstract class Controller {
  abstract handle(httpRequest: HttpRequest): Promise<HttpResponse>;

  protected ok<T extends object>(
    data: T,
    headers?: IncomingHttpHeaders,
  ): HttpResponse {
    return {
      statusCode: 200,
      body: data,
      headers,
    };
  }

  protected badRequest(error: Error): HttpResponse {
    return {
      statusCode: 400,
      body: {
        message: error.message,
      },
    };
  }

  protected notFound(error: Error): HttpResponse {
    return {
      statusCode: 404,
      body: {
        message: error.message,
      },
    };
  }

  protected conflict(error: Error): HttpResponse {
    return {
      statusCode: 409,
      body: {
        message: error.message,
      },
    };
  }

  protected unprocessableEntity(error: InvalidDataError): HttpResponse {
    return {
      statusCode: 422,
      body: { ...error.fields },
    };
  }

  protected serverError(reason: string): HttpResponse {
    return {
      statusCode: 500,
      body: {
        message: reason,
      },
    };
  }

  protected created<T extends object>(
    data: T,
    headers?: IncomingHttpHeaders,
  ): HttpResponse {
    return {
      statusCode: 201,
      body: data,
      headers,
    };
  }
}
