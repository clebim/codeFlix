import 'reflect-metadata';
import { makeCategoryMock } from '@tests/mocks/category/category';
import { updateCategoryUseCaseMock } from '@tests/mocks/use-case.mock';
import { UpdateCategoryRequest } from '@usecases/category/update-category-use-case';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { NotFoundError } from '@usecases/errors/not-found-error';
import faker from 'faker';
import { mockReset } from 'jest-mock-extended';

import { HttpRequest } from '../port/http-request';
import { UpdateCategoryController } from './update-category-controller';

let controller: UpdateCategoryController;

describe('Update category controller test', () => {
  beforeEach(() => {
    controller = new UpdateCategoryController(updateCategoryUseCaseMock);
    mockReset(updateCategoryUseCaseMock);
  });

  describe('When update category controller called', () => {
    it('and return a updated category', async () => {
      const request: HttpRequest<
        Omit<UpdateCategoryRequest, 'id'>,
        any,
        { id: string }
      > = {
        body: {
          name: faker.datatype.string(32),
          description: faker.datatype.string(164),
        },
        params: {
          id: faker.datatype.uuid(),
        },
      };

      const category = makeCategoryMock().toDTO();
      const useCaseResponse = {
        isSuccess: true,
        isFailure: false,
        error: null,
        data: category,
      };

      updateCategoryUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toEqual(category);
      expect(response.statusCode).toEqual(200);
      expect(updateCategoryUseCaseMock.execute).toBeCalledTimes(1);
      expect(updateCategoryUseCaseMock.execute).toBeCalledWith({
        ...request.params,
        ...request.body,
      });
    });

    it('and return a unprocessable entity', async () => {
      const request: HttpRequest<
        Omit<UpdateCategoryRequest, 'id'>,
        any,
        { id: string }
      > = {
        params: {
          id: undefined,
        },
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
          id: 'id is required',
        }),
        data: null,
      };

      updateCategoryUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toBeTruthy();
      expect(response.statusCode).toEqual(422);
      expect(updateCategoryUseCaseMock.execute).toBeCalledTimes(1);
      expect(updateCategoryUseCaseMock.execute).toBeCalledWith({
        ...request.params,
        ...request.body,
      });
    });

    it('and return not found entity', async () => {
      const request: HttpRequest<
        Omit<UpdateCategoryRequest, 'id'>,
        any,
        { id: string }
      > = {
        params: {
          id: faker.datatype.uuid(),
        },
        body: {
          description: faker.datatype.string(164),
        },
      };

      const useCaseResponse = {
        isSuccess: false,
        isFailure: true,
        error: new NotFoundError('Category not found'),
        data: null,
      };

      updateCategoryUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toBeTruthy();
      expect(response.body).toEqual({ message: 'Category not found' });
      expect(response.statusCode).toEqual(404);
      expect(updateCategoryUseCaseMock.execute).toBeCalledTimes(1);
      expect(updateCategoryUseCaseMock.execute).toBeCalledWith({
        ...request.params,
        ...request.body,
      });
    });

    test('and return server error', async () => {
      const request: HttpRequest<
        Omit<UpdateCategoryRequest, 'id'>,
        any,
        { id: string }
      > = {
        params: {
          id: undefined,
        },
        body: {
          name: '',
          description: faker.datatype.string(164),
        },
      };

      updateCategoryUseCaseMock.execute.mockRejectedValue(
        new Error('any error'),
      );

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        message: 'Internal server error',
      });
    });
  });
});
