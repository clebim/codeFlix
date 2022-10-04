import 'reflect-metadata';
import { Category } from '@entities/category';
import { makeCategoryMock } from '@tests/mocks/category/category';
import { makeUpdateCategoryMock } from '@tests/mocks/category/update-category.mock';
import { categoryRepositoryMock } from '@tests/mocks/repository.mock';
import { loggerMock } from '@tests/mocks/service.mock';
import { updateCategoryValidatorMock } from '@tests/mocks/validator.mock';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { NotFoundError } from '@usecases/errors/not-found-error';
import { UseCase } from '@usecases/port/use-case';
import { mockReset } from 'jest-mock-extended';

import {
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  UpdateCategoryUseCase,
} from './update-category-use-case';

let useCase: UseCase<UpdateCategoryRequest, UpdateCategoryResponse>;

describe('Create category use case test', () => {
  beforeEach(() => {
    mockReset(loggerMock);
    mockReset(categoryRepositoryMock);
    mockReset(updateCategoryValidatorMock);
    jest.clearAllMocks();
    useCase = new UpdateCategoryUseCase(
      loggerMock,
      categoryRepositoryMock,
      updateCategoryValidatorMock,
    );
  });

  describe('When update category is called', () => {
    it('and should return the updated category with isActive = true', async () => {
      const categoryInApi = makeCategoryMock();
      const request = makeUpdateCategoryMock({
        id: categoryInApi.id,
        description: categoryInApi.props.description,
        name: 'Matheus',
        isActive: true,
      });
      const entity = new Category({
        id: request.id,
        name: request.name,
        description: request.description,
        isActive: request.isActive,
      });

      jest.useFakeTimers().setSystemTime(new Date());
      updateCategoryValidatorMock.validate.mockReturnValue({
        isValid: true,
        value: request,
      });

      categoryRepositoryMock.getUniqueBy.mockResolvedValue(categoryInApi);
      categoryRepositoryMock.save.mockResolvedValue(entity);

      const response = await useCase.execute(request);

      expect(response).toBeTruthy();
      expect(updateCategoryValidatorMock.validate).toBeCalledTimes(1);
      expect(updateCategoryValidatorMock.validate).toBeCalledWith(request);
      expect(categoryRepositoryMock.getUniqueBy).toBeCalledTimes(1);
      expect(categoryRepositoryMock.getUniqueBy).toHaveBeenCalledWith({
        id: request.id,
      });
      expect(categoryRepositoryMock.save).toBeCalledTimes(1);
      expect(response.data).toEqual({
        id: request.id,
        name: request.name,
        description: request.description,
        isActive: true,
        createdAt: categoryInApi.props.createdAt,
      });
    });

    it('and should return the updated category with isActive = false', async () => {
      const categoryInApi = makeCategoryMock();
      const request = makeUpdateCategoryMock({
        id: categoryInApi.id,
        description: categoryInApi.props.description,
        name: 'Matheus',
        isActive: false,
      });
      const entity = new Category({
        id: request.id,
        name: request.name,
        description: request.description,
        isActive: request.isActive,
      });

      jest.useFakeTimers().setSystemTime(new Date());
      updateCategoryValidatorMock.validate.mockReturnValue({
        isValid: true,
        value: request,
      });

      categoryRepositoryMock.getUniqueBy.mockResolvedValue(categoryInApi);
      categoryRepositoryMock.save.mockResolvedValue(entity);

      const response = await useCase.execute(request);

      expect(response).toBeTruthy();
      expect(updateCategoryValidatorMock.validate).toBeCalledTimes(1);
      expect(updateCategoryValidatorMock.validate).toBeCalledWith(request);
      expect(categoryRepositoryMock.getUniqueBy).toBeCalledTimes(1);
      expect(categoryRepositoryMock.getUniqueBy).toHaveBeenCalledWith({
        id: request.id,
      });
      expect(categoryRepositoryMock.save).toBeCalledTimes(1);
      expect(response.data).toEqual({
        id: request.id,
        name: request.name,
        description: request.description,
        isActive: false,
        createdAt: categoryInApi.props.createdAt,
      });
    });

    describe('and get a error because', () => {
      it('invalid request body', async () => {
        const request = makeUpdateCategoryMock();

        updateCategoryValidatorMock.validate.mockReturnValue({
          isValid: false,
          value: request,
          invalidFields: [],
        });

        const response = await useCase.execute(request);

        expect(response).toBeTruthy();
        expect(response.isFailure).toBeTruthy();
        expect(response.error).toBeInstanceOf(InvalidDataError);
        expect(updateCategoryValidatorMock.validate).toBeCalledTimes(1);
        expect(updateCategoryValidatorMock.validate).toBeCalledWith(request);
        expect(categoryRepositoryMock.save).toBeCalledTimes(0);
        expect(response.data).not.toBeTruthy();
      });

      it('Category not exists in api', async () => {
        const request = makeUpdateCategoryMock();

        jest.useFakeTimers().setSystemTime(new Date());
        updateCategoryValidatorMock.validate.mockReturnValue({
          isValid: true,
          value: request,
        });

        categoryRepositoryMock.getUniqueBy.mockResolvedValue(undefined);

        const response = await useCase.execute(request);

        expect(response.isFailure).toBeTruthy();
        expect(response.error).toBeInstanceOf(NotFoundError);
        expect(updateCategoryValidatorMock.validate).toBeCalledTimes(1);
        expect(updateCategoryValidatorMock.validate).toBeCalledWith(request);
        expect(categoryRepositoryMock.getUniqueBy).toBeCalledTimes(1);
        expect(categoryRepositoryMock.getUniqueBy).toBeCalledWith({
          id: request.id,
        });
        expect(categoryRepositoryMock.save).toBeCalledTimes(0);
        expect(response.data).not.toBeTruthy();
        expect(response.error.message).toContain(request.id);
      });

      it('fatal error in category repository', async () => {
        const request = makeUpdateCategoryMock();
        const error = new Error('Fatal Error');

        updateCategoryValidatorMock.validate.mockReturnValue({
          isValid: true,
          value: request,
        });
        categoryRepositoryMock.getUniqueBy.mockRejectedValue(error);

        try {
          await useCase.execute(request);
        } catch (error) {
          expect(loggerMock.error).toBeCalledTimes(1);
          expect(loggerMock.error).toBeCalledWith(error);
          expect(updateCategoryValidatorMock.validate).toBeCalledTimes(1);
          expect(updateCategoryValidatorMock.validate).toBeCalledWith(request);
          expect(categoryRepositoryMock.save).toBeCalledTimes(0);
          expect(error.message).toBe('Fatal Error');
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });
});
