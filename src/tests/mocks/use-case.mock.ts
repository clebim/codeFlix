import {
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@usecases/category/create-category-use-case';
import { UseCase } from '@usecases/port/use-case';
import { mock, MockProxy } from 'jest-mock-extended';

export const createCategoryUseCaseMock: MockProxy<
  UseCase<CreateCategoryRequest, CreateCategoryResponse>
> &
  UseCase<CreateCategoryRequest, CreateCategoryResponse> =
  mock<UseCase<CreateCategoryRequest, CreateCategoryResponse>>();
