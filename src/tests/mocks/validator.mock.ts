import { CreateCategoryRequest } from '@usecases/category/create-category-use-case';
import { ListCategoryRequest } from '@usecases/category/list-category-use-case';
import { UpdateCategoryRequest } from '@usecases/category/update-category-use-case';
import { RequestValidator } from '@usecases/port/request-validator';
import { mock, MockProxy } from 'jest-mock-extended';

export const createCategoryValidatorMock: MockProxy<
  RequestValidator<CreateCategoryRequest>
> &
  RequestValidator<CreateCategoryRequest> =
  mock<RequestValidator<CreateCategoryRequest>>();

export const listCategoryValidatorMock: MockProxy<
  RequestValidator<ListCategoryRequest>
> &
  RequestValidator<ListCategoryRequest> =
  mock<RequestValidator<ListCategoryRequest>>();

export const updateCategoryValidatorMock: MockProxy<
  RequestValidator<UpdateCategoryRequest>
> &
  RequestValidator<UpdateCategoryRequest> =
  mock<RequestValidator<UpdateCategoryRequest>>();
