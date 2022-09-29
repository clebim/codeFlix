import { Category, CategoryProperties } from '@entities/category';
import { changeValuesMock } from '@tests/helper/mock-helper.mock';

import { makeCategoryMock } from './category';

export const makeCategoryListMock = (
  valueHasToBeReplaced?: Partial<CategoryProperties>[],
  replaceInsideListObject = false,
): Category[] => {
  const valuesReplaced = changeValuesMock<CategoryProperties[]>(
    [
      makeCategoryMock().toDTO(),
      makeCategoryMock().toDTO(),
      makeCategoryMock().toDTO(),
    ],
    valueHasToBeReplaced,
    replaceInsideListObject,
  );

  return valuesReplaced.map(category => new Category(category));
};
