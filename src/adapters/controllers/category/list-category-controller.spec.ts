import 'reflect-metadata';
import { makeCategoryListMock } from '@tests/mocks/category/category-list';
import { listCategoryUseCaseMock } from '@tests/mocks/use-case.mock';
import { ListCategoryRequest } from '@usecases/category/list-category-use-case';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import faker from 'faker';
import { mockReset } from 'jest-mock-extended';

import { HttpRequest } from '../port/http-request';
import { ListCategoryController } from './list-category-controller';

let controller: ListCategoryController;

describe('List category controller test', () => {
  beforeEach(() => {
    controller = new ListCategoryController(listCategoryUseCaseMock);
    mockReset(listCategoryUseCaseMock);
  });

  describe('When list category controller called', () => {
    it('and return a list of category', async () => {
      const request: HttpRequest<ListCategoryRequest> = {
        query: {
          name: faker.datatype.string(32),
          description: faker.datatype.string(164),
        },
      };

      const categoryList = makeCategoryListMock().map(category =>
        category.toDTO(),
      );
      const useCaseResponse = {
        isSuccess: true,
        isFailure: false,
        error: null,
        data: categoryList,
      };

      listCategoryUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body.categories).toEqual(categoryList);
      expect(response.statusCode).toEqual(200);
      expect(listCategoryUseCaseMock.execute).toBeCalledTimes(1);
      expect(listCategoryUseCaseMock.execute).toBeCalledWith(request.query);
    });

    it('and return a unprocessable entity', async () => {
      const request: HttpRequest<ListCategoryRequest> = {
        body: {
          name: '',
          description: faker.datatype.string(164),
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

      listCategoryUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toBeTruthy();
      expect(response.statusCode).toEqual(422);
      expect(listCategoryUseCaseMock.execute).toBeCalledTimes(1);
      expect(listCategoryUseCaseMock.execute).toBeCalledWith(request.query);
    });

    test('and return server error', async () => {
      const request: HttpRequest<ListCategoryRequest> = {
        body: {
          name: '',
          description: faker.datatype.string(164),
        },
      };

      listCategoryUseCaseMock.execute.mockRejectedValue(new Error('any error'));

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        message: 'Internal server error',
      });
    });
  });
});
