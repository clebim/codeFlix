import 'reflect-metadata';
import { makeCategoryListMock } from '@tests/mocks/category/category-list';
import { categoryRepositoryMock } from '@tests/mocks/repository.mock';
import { loggerMock } from '@tests/mocks/service.mock';
import { listCategoryValidatorMock } from '@tests/mocks/validator.mock';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UseCase } from '@usecases/port/use-case';
import faker from 'faker';
import { mockReset } from 'jest-mock-extended';

import {
  ListCategoryRequest,
  ListCategoryResponse,
  ListCategoryUseCase,
} from './list-category-use-case';

let useCase: UseCase<ListCategoryRequest, ListCategoryResponse>;

describe('List category use case test', () => {
  beforeEach(() => {
    mockReset(loggerMock);
    mockReset(categoryRepositoryMock);
    mockReset(listCategoryValidatorMock);
    useCase = new ListCategoryUseCase(
      loggerMock,
      categoryRepositoryMock,
      listCategoryValidatorMock,
    );
  });

  describe('When list category use case called', () => {
    it('Should return a categoty list with success', async () => {
      const request = { description: faker.datatype.string() };
      const categoryList = makeCategoryListMock();

      listCategoryValidatorMock.validate.mockReturnValue({
        isValid: true,
        value: request,
      });

      categoryRepositoryMock.listCategory.mockResolvedValue(categoryList);

      const { data, isSuccess } = await useCase.execute(request);

      expect(data).toBeTruthy();
      expect(isSuccess).toBeTruthy();
      expect(data).toHaveLength(3);
      expect(categoryRepositoryMock.listCategory).toBeCalledTimes(1);
      expect(categoryRepositoryMock.listCategory).toBeCalledWith({
        description: request.description,
      });
    });

    describe('and get a error because', () => {
      it('invalid request body', async () => {
        const request = { description: '' };

        listCategoryValidatorMock.validate.mockReturnValue({
          isValid: false,
          value: request,
          invalidFields: [],
        });

        const { isFailure, error, data } = await useCase.execute(request);

        expect(isFailure).toBeTruthy();
        expect(error).toBeInstanceOf(InvalidDataError);
        expect(listCategoryValidatorMock.validate).toBeCalledTimes(1);
        expect(listCategoryValidatorMock.validate).toBeCalledWith(request);
        expect(categoryRepositoryMock.listCategory).toBeCalledTimes(0);
        expect(data).not.toBeTruthy();
      });

      it('fatal error in category repository', async () => {
        const request = { description: faker.datatype.string() };
        const error = new Error('Fatal Error');

        listCategoryValidatorMock.validate.mockReturnValue({
          isValid: true,
          value: request,
        });
        categoryRepositoryMock.listCategory.mockRejectedValue(error);

        try {
          await useCase.execute(request);
        } catch (error) {
          expect(loggerMock.error).toBeCalledTimes(1);
          expect(loggerMock.error).toBeCalledWith(error);
          expect(listCategoryValidatorMock.validate).toBeCalledTimes(1);
          expect(listCategoryValidatorMock.validate).toBeCalledWith(request);
          expect(categoryRepositoryMock.listCategory).toBeCalledTimes(1);
          expect(error.message).toBe('Fatal Error');
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });
});
