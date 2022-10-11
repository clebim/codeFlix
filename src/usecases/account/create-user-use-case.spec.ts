import 'reflect-metadata';
import { User } from '@entities/user';
import { userRepositoryMock } from '@tests/mocks/repository.mock';
import { loggerMock } from '@tests/mocks/service.mock';
import { makeCreateUserMock } from '@tests/mocks/user/create-user.mock';
import { createUserValidatorMock } from '@tests/mocks/validator.mock';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UserAlreadyExistsError } from '@usecases/errors/user/user-already-exists-error';
import { UseCase } from '@usecases/port/use-case';
import faker from 'faker';
import { mockReset } from 'jest-mock-extended';
import * as uuidApi from 'uuid';

import {
  CreateUserRequest,
  CreateUserResponse,
  CreateUserUseCase,
} from './create-user-use-case';

let useCase: UseCase<CreateUserRequest, CreateUserResponse>;

jest.mock('bcrypt', () => ({
  hash: (_, __, cb) => cb(null, faker.datatype.string(96)),
}));
jest.mock('uuid');

describe('Create user use case test', () => {
  beforeEach(() => {
    mockReset(loggerMock);
    mockReset(userRepositoryMock);
    mockReset(createUserValidatorMock);
    jest.clearAllMocks();
    useCase = new CreateUserUseCase(
      loggerMock,
      userRepositoryMock,
      createUserValidatorMock,
    );
  });

  describe('When create user is called', () => {
    it('and should return the new user with success', async () => {
      const request = makeCreateUserMock();
      const uuid = faker.datatype.uuid();

      jest.useFakeTimers().setSystemTime(new Date());
      createUserValidatorMock.validate.mockReturnValue({
        isValid: true,
        value: request,
      });
      jest.spyOn(uuidApi, 'v4').mockReturnValue(uuid);

      const response = await useCase.execute(request);

      expect(response).toBeTruthy();
      expect(createUserValidatorMock.validate).toBeCalledTimes(1);
      expect(createUserValidatorMock.validate).toBeCalledWith(request);
      expect(userRepositoryMock.getUniqueBy).toBeCalledTimes(1);
      expect(userRepositoryMock.getUniqueBy).toBeCalledWith({
        email: request.email,
      });
      expect(userRepositoryMock.save).toBeCalledTimes(1);
      expect(response.data).toEqual({
        id: uuid,
        name: request.name,
        email: request.email,
        isActive: true,
        photo: null,
        videos: [],
        createdAt: new Date(),
      });
    });

    describe('and get a error because', () => {
      it('Invalid request body', async () => {
        const request = makeCreateUserMock();

        createUserValidatorMock.validate.mockReturnValue({
          isValid: false,
          value: request,
          invalidFields: [],
        });

        const response = await useCase.execute(request);

        expect(response).toBeTruthy();
        expect(response.isFailure).toBeTruthy();
        expect(response.error).toBeInstanceOf(InvalidDataError);
        expect(createUserValidatorMock.validate).toBeCalledTimes(1);
        expect(createUserValidatorMock.validate).toBeCalledWith(request);
        expect(userRepositoryMock.getUniqueBy).toBeCalledTimes(0);
        expect(userRepositoryMock.save).toBeCalledTimes(0);
        expect(response.data).not.toBeTruthy();
      });

      it('Email already registered on the platform', async () => {
        const request = makeCreateUserMock();
        const userEntity = new User(request);
        const uuid = faker.datatype.uuid();

        jest.useFakeTimers().setSystemTime(new Date());
        createUserValidatorMock.validate.mockReturnValue({
          isValid: true,
          value: request,
        });
        jest.spyOn(uuidApi, 'v4').mockReturnValue(uuid);
        userRepositoryMock.getUniqueBy.mockResolvedValue(userEntity);

        const response = await useCase.execute(request);

        expect(response.isFailure).toBeTruthy();
        expect(response.error).toBeInstanceOf(UserAlreadyExistsError);
        expect(createUserValidatorMock.validate).toBeCalledTimes(1);
        expect(createUserValidatorMock.validate).toBeCalledWith(request);
        expect(userRepositoryMock.getUniqueBy).toBeCalledTimes(1);
        expect(userRepositoryMock.getUniqueBy).toBeCalledWith({
          email: request.email,
        });
        expect(userRepositoryMock.save).toBeCalledTimes(0);
        expect(response.data).not.toBeTruthy();
      });

      it('fatal error in category repository', async () => {
        const request = makeCreateUserMock();
        const error = new Error('Fatal Error');

        createUserValidatorMock.validate.mockReturnValue({
          isValid: true,
          value: request,
        });
        userRepositoryMock.getUniqueBy.mockRejectedValue(error);

        try {
          await useCase.execute(request);
        } catch (error) {
          expect(loggerMock.error).toBeCalledTimes(1);
          expect(loggerMock.error).toBeCalledWith(error);
          expect(createUserValidatorMock.validate).toBeCalledTimes(1);
          expect(createUserValidatorMock.validate).toBeCalledWith(request);
          expect(userRepositoryMock.getUniqueBy).toBeCalledTimes(1);
          expect(error.message).toBe('Fatal Error');
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });
});
