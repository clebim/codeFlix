import { UserRepository } from '@usecases/account/port/user-repository';
import { CategoryRepository } from '@usecases/category/port/category-repository';
import { VideoRepository } from '@usecases/video/port/video-repository';
import { mock, MockProxy } from 'jest-mock-extended';

export const categoryRepositoryMock: MockProxy<CategoryRepository> &
  CategoryRepository = mock<CategoryRepository>();

export const videoRepositoryMock: MockProxy<VideoRepository> & VideoRepository =
  mock<VideoRepository>();

export const userRepositoryMock: MockProxy<UserRepository> & UserRepository =
  mock<UserRepository>();
