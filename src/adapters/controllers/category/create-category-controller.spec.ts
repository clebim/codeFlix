import 'reflect-metadata';
import { makeCategoryMock } from '@tests/mocks/category/category';
import { createCategoryUseCaseMock } from '@tests/mocks/use-case.mock';
import { CreateCategoryRequest } from '@usecases/category/create-category-use-case';
import { CategoryAlreadyExistsError } from '@usecases/errors/category/category-already-exists-error';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import faker from 'faker';
import { mockReset } from 'jest-mock-extended';

import { HttpRequest } from '../port/http-request';
import { CreateCategoryController } from './create-category-controller';

let controller: CreateCategoryController;

describe('Create category controller test', () => {
  beforeEach(() => {
    controller = new CreateCategoryController(createCategoryUseCaseMock);
    mockReset(createCategoryUseCaseMock);
  });

  describe('When create category controller called', () => {
    it('and return created category', async () => {
      const request: HttpRequest<CreateCategoryRequest> = {
        body: {
          name: faker.datatype.string(32),
          description: faker.datatype.string(164),
        },
      };

      const category = makeCategoryMock().toDTO();
      const useCaseResponse = {
        isSuccess: true,
        isFailure: false,
        error: null,
        data: category,
      };

      createCategoryUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toEqual(category);
      expect(response.statusCode).toEqual(201);
      expect(createCategoryUseCaseMock.execute).toBeCalledTimes(1);
      expect(createCategoryUseCaseMock.execute).toBeCalledWith(request.body);
    });

    it('and return a conflict', async () => {
      const request: HttpRequest<CreateCategoryRequest> = {
        body: {
          name: faker.datatype.string(36),
          description: faker.datatype.string(164),
        },
      };

      const useCaseResponse = {
        isSuccess: false,
        isFailure: true,
        error: new CategoryAlreadyExistsError(),
        data: null,
      };

      createCategoryUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toBeTruthy();
      expect(response.statusCode).toEqual(409);
      expect(createCategoryUseCaseMock.execute).toBeCalledTimes(1);
      expect(createCategoryUseCaseMock.execute).toBeCalledWith(request.body);
    });

    it('and return a unprocessable entity', async () => {
      const request: HttpRequest<CreateCategoryRequest> = {
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

      createCategoryUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toBeTruthy();
      expect(response.statusCode).toEqual(422);
      expect(createCategoryUseCaseMock.execute).toBeCalledTimes(1);
      expect(createCategoryUseCaseMock.execute).toBeCalledWith(request.body);
    });

    test('and return server error', async () => {
      const request: HttpRequest<CreateCategoryRequest> = {
        body: {
          name: '',
          description: faker.datatype.string(164),
        },
      };

      createCategoryUseCaseMock.execute.mockRejectedValue(
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
