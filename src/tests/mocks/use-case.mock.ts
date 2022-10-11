import {
  CreateUserRequest,
  CreateUserResponse,
} from '@usecases/account/create-user-use-case';
import {
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@usecases/category/create-category-use-case';
import {
  ListCategoryRequest,
  ListCategoryResponse,
} from '@usecases/category/list-category-use-case';
import {
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from '@usecases/category/update-category-use-case';
import { UseCase } from '@usecases/port/use-case';
import {
  CreateVideoRequest,
  CreateVideoResponse,
} from '@usecases/video/create-video-use-case';
import { mock, MockProxy } from 'jest-mock-extended';

export const createCategoryUseCaseMock: MockProxy<
  UseCase<CreateCategoryRequest, CreateCategoryResponse>
> &
  UseCase<CreateCategoryRequest, CreateCategoryResponse> =
  mock<UseCase<CreateCategoryRequest, CreateCategoryResponse>>();

export const listCategoryUseCaseMock: MockProxy<
  UseCase<ListCategoryRequest, ListCategoryResponse>
> &
  UseCase<ListCategoryRequest, ListCategoryResponse> =
  mock<UseCase<ListCategoryRequest, ListCategoryResponse>>();

export const updateCategoryUseCaseMock: MockProxy<
  UseCase<UpdateCategoryRequest, UpdateCategoryResponse>
> &
  UseCase<UpdateCategoryRequest, UpdateCategoryResponse> =
  mock<UseCase<UpdateCategoryRequest, UpdateCategoryResponse>>();

export const createVideoUseCaseMock: MockProxy<
  UseCase<CreateVideoRequest, CreateVideoResponse>
> &
  UseCase<CreateVideoRequest, CreateVideoResponse> =
  mock<UseCase<CreateVideoRequest, CreateVideoResponse>>();

export const createUserUseCaseMock: MockProxy<
  UseCase<CreateUserRequest, CreateUserResponse>
> &
  UseCase<CreateUserRequest, CreateUserResponse> =
  mock<UseCase<CreateUserRequest, CreateUserResponse>>();
