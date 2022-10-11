import 'reflect-metadata';
import { createUserUseCaseMock } from '@tests/mocks/use-case.mock';
import { makeUserMock } from '@tests/mocks/user/user.mock';
import { CreateUserRequest } from '@usecases/account/create-user-use-case';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UserAlreadyExistsError } from '@usecases/errors/user/user-already-exists-error';
import faker from 'faker';
import { mockReset } from 'jest-mock-extended';

import { HttpRequest } from '../port/http-request';
import { CreateUserController } from './create-user-controller';

let controller: CreateUserController;

describe('Create user controller test', () => {
  beforeEach(() => {
    controller = new CreateUserController(createUserUseCaseMock);
    mockReset(createUserUseCaseMock);
  });

  describe('When create user controller called', () => {
    it('and return created user', async () => {
      const password = faker.datatype.string();
      const request: HttpRequest<CreateUserRequest> = {
        body: {
          name: faker.datatype.string(),
          email: faker.internet.email(),
          password,
          passwordConfirmation: password,
        },
      };

      const user = makeUserMock().toDTO();
      const useCaseResponse = {
        isSuccess: true,
        isFailure: false,
        error: null,
        data: user,
      };

      createUserUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      delete user.password;

      expect(response.body).toEqual(user);
      expect(response.statusCode).toEqual(201);
      expect(createUserUseCaseMock.execute).toBeCalledTimes(1);
      expect(createUserUseCaseMock.execute).toBeCalledWith(request.body);
    });

    it('and return a conflict', async () => {
      const password = faker.datatype.string();
      const request: HttpRequest<CreateUserRequest> = {
        body: {
          name: faker.datatype.string(),
          email: faker.internet.email(),
          password,
          passwordConfirmation: password,
        },
      };

      const useCaseResponse = {
        isSuccess: false,
        isFailure: true,
        error: new UserAlreadyExistsError('user already exists'),
        data: null,
      };

      createUserUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toBeTruthy();
      expect(response.statusCode).toEqual(409);
      expect(createUserUseCaseMock.execute).toBeCalledTimes(1);
      expect(createUserUseCaseMock.execute).toBeCalledWith(request.body);
    });

    it('and return a unprocessable entity', async () => {
      const password = faker.datatype.string();
      const request: HttpRequest<CreateUserRequest> = {
        body: {
          name: '',
          email: faker.internet.email(),
          password,
          passwordConfirmation: password,
        },
      };

      const useCaseResponse = {
        isSuccess: false,
        isFailure: true,
        error: new InvalidDataError({
          name: 'name is required',
        }),
        data: null,
      };

      createUserUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toBeTruthy();
      expect(response.statusCode).toEqual(422);
      expect(createUserUseCaseMock.execute).toBeCalledTimes(1);
      expect(createUserUseCaseMock.execute).toBeCalledWith(request.body);
    });

    test('and return server error', async () => {
      const password = faker.datatype.string();
      const request: HttpRequest<CreateUserRequest> = {
        body: {
          name: '',
          email: faker.internet.email(),
          password,
          passwordConfirmation: password,
        },
      };

      createUserUseCaseMock.execute.mockRejectedValue(new Error('any error'));

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        message: 'Internal server error',
      });
    });
  });
});
