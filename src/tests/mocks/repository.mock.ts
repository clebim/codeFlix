import { CategoryRepository } from '@usecases/category/port/category-repostitory';
import { mock, MockProxy } from 'jest-mock-extended';

export const categoryRepositoryMock: MockProxy<CategoryRepository> &
  CategoryRepository = mock<CategoryRepository>();
