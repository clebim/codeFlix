import { CreateUserRequest } from '@usecases/account/create-user-use-case';
import { CreateCategoryRequest } from '@usecases/category/create-category-use-case';
import { ListCategoryRequest } from '@usecases/category/list-category-use-case';
import { UpdateCategoryRequest } from '@usecases/category/update-category-use-case';
import { RequestValidator } from '@usecases/port/request-validator';
import { CreateVideoRequest } from '@usecases/video/create-video-use-case';
import { ListVideosRequest } from '@usecases/video/list-videos-use-case';
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

export const createVideoValidatorMock: MockProxy<
  RequestValidator<CreateVideoRequest>
> &
  RequestValidator<CreateVideoRequest> =
  mock<RequestValidator<CreateVideoRequest>>();

export const createUserValidatorMock: MockProxy<
  RequestValidator<CreateUserRequest>
> &
  RequestValidator<CreateUserRequest> =
  mock<RequestValidator<CreateUserRequest>>();

export const listVideosValidatorMock: MockProxy<
  RequestValidator<ListVideosRequest>
> &
  RequestValidator<ListVideosRequest> =
  mock<RequestValidator<ListVideosRequest>>();
