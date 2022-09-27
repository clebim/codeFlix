import { CreateCategoryRequest } from '@usecases/category/create-category-use-case';
import { RequestValidator } from '@usecases/port/request-validator';
import { mock, MockProxy } from 'jest-mock-extended';

export const createCategoryValidatorMock: MockProxy<
  RequestValidator<CreateCategoryRequest>
> &
  RequestValidator<CreateCategoryRequest> =
  mock<RequestValidator<CreateCategoryRequest>>();
