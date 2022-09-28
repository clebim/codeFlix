import { Category } from '@entities/category';
import { CreateCategoryRequest } from '@usecases/category/create-category-use-case';

import { makeCreateCategoryMock } from './create-category.mock';

export const makeCategoryMock = (
  valueHasToBeReplaced?: Partial<CreateCategoryRequest>,
  replaceInsideListObject = false,
) =>
  new Category(
    makeCreateCategoryMock(valueHasToBeReplaced, replaceInsideListObject),
  );
