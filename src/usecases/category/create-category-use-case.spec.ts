import 'reflect-metadata';
import { Category } from '@entities/category';
import { makeCreateCategoryMock } from '@tests/mocks/category/create-category.mock';
import { categoryRepositoryMock } from '@tests/mocks/repository.mock';
import { loggerMock } from '@tests/mocks/service.mock';
import { createCategoryValidatorMock } from '@tests/mocks/validator.mock';
import { CategoryAlreadyExistsError } from '@usecases/errors/category/category-already-exists-error';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UseCase } from '@usecases/port/use-case';
import faker from 'faker';
import { mockReset } from 'jest-mock-extended';
import * as uuidApi from 'uuid';

import {
  CreateCategoryUseCase,
  CreateCategoryRequest,
  CreateCategoryResponse,
} from './create-category-use-case';

let useCase: UseCase<CreateCategoryRequest, CreateCategoryResponse>;

jest.mock('uuid');
describe('Create category use case test', () => {
  beforeEach(() => {
    mockReset(loggerMock);
    mockReset(categoryRepositoryMock);
    mockReset(createCategoryValidatorMock);
    jest.clearAllMocks();
    useCase = new CreateCategoryUseCase(
      loggerMock,
      categoryRepositoryMock,
      createCategoryValidatorMock,
    );
  });

  describe('When create category is called', () => {
    it('and should return the new category', async () => {
      const request = makeCreateCategoryMock();
      const categoryEntity = new Category(request);
      const uuid = faker.datatype.uuid();

      jest.useFakeTimers().setSystemTime(new Date());
      createCategoryValidatorMock.validate.mockReturnValue({
        isValid: true,
        value: request,
      });
      jest.spyOn(uuidApi, 'v4').mockReturnValue(uuid);
      categoryRepositoryMock.save.mockResolvedValue(categoryEntity);

      const response = await useCase.execute(request);

      expect(response).toBeTruthy();
      expect(createCategoryValidatorMock.validate).toBeCalledTimes(1);
      expect(createCategoryValidatorMock.validate).toBeCalledWith(request);
      expect(categoryRepositoryMock.save).toBeCalledTimes(1);
      expect(response.data).toEqual({
        id: uuid,
        name: request.name,
        description: request.description,
        isActive: true,
        createdAt: new Date(),
      });
    });

    describe('and get a error because', () => {
      it('invalid request body', async () => {
        const request = makeCreateCategoryMock();

        createCategoryValidatorMock.validate.mockReturnValue({
          isValid: false,
          value: request,
          invalidFields: [],
        });

        const response = await useCase.execute(request);

        expect(response).toBeTruthy();
        expect(response.isFailure).toBeTruthy();
        expect(response.error).toBeInstanceOf(InvalidDataError);
        expect(createCategoryValidatorMock.validate).toBeCalledTimes(1);
        expect(createCategoryValidatorMock.validate).toBeCalledWith(request);
        expect(categoryRepositoryMock.save).toBeCalledTimes(0);
        expect(response.data).not.toBeTruthy();
      });

      it('Category already exists in api', async () => {
        const request = makeCreateCategoryMock();
        const categoryEntity = new Category(request);
        const uuid = faker.datatype.uuid();

        jest.useFakeTimers().setSystemTime(new Date());
        createCategoryValidatorMock.validate.mockReturnValue({
          isValid: true,
          value: request,
        });
        jest.spyOn(uuidApi, 'v4').mockReturnValue(uuid);
        categoryRepositoryMock.getUniqueBy.mockResolvedValue(categoryEntity);

        const response = await useCase.execute(request);

        expect(response.isFailure).toBeTruthy();
        expect(response.error).toBeInstanceOf(CategoryAlreadyExistsError);
        expect(createCategoryValidatorMock.validate).toBeCalledTimes(1);
        expect(createCategoryValidatorMock.validate).toBeCalledWith(request);
        expect(categoryRepositoryMock.getUniqueBy).toBeCalledTimes(1);
        expect(categoryRepositoryMock.getUniqueBy).toBeCalledWith({
          name: request.name,
        });
        expect(categoryRepositoryMock.save).toBeCalledTimes(0);
        expect(response.data).not.toBeTruthy();
      });

      it('fatal error in category repository', async () => {
        const request = makeCreateCategoryMock();
        const error = new Error('Fatal Error');

        createCategoryValidatorMock.validate.mockReturnValue({
          isValid: true,
          value: request,
        });
        categoryRepositoryMock.save.mockRejectedValue(error);

        try {
          await useCase.execute(request);
        } catch (error) {
          expect(loggerMock.error).toBeCalledTimes(1);
          expect(loggerMock.error).toBeCalledWith(error);
          expect(createCategoryValidatorMock.validate).toBeCalledTimes(1);
          expect(createCategoryValidatorMock.validate).toBeCalledWith(request);
          expect(categoryRepositoryMock.save).toBeCalledTimes(1);
          expect(error.message).toBe('Fatal Error');
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });
});
