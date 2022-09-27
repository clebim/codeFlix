import { getMockReq, getMockRes } from '@jest-mock/express';
import { appConfig } from '@main/config';

import { handlerError } from './handler-error';

jest.mock('@main/config');

const configMock = appConfig as jest.Mocked<typeof appConfig>;

describe('Test handler error', () => {
  beforeEach(() => {
    configMock.PROD = false;
  });

  test('Should response Error when environment different from prod', async () => {
    const mockRequest = getMockReq({});
    const { res, next } = getMockRes();
    const error = new Error('Any Error.');

    handlerError(error, mockRequest, res, next);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      code: 'SERVER-000',
      message: error.message,
      exception: error,
      stack: error.stack,
    });
  });

  test('Should response Internal server error when environment equal from prod', async () => {
    configMock.PROD = true;
    const mockRequest = getMockReq({});
    const { res, next } = getMockRes();
    const error = new Error('Any Error.');

    handlerError(error, mockRequest, res, next);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      code: 'SERVER-000',
      message: 'Internal server error',
    });
  });
});
