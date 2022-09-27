import { changeValuesMock } from '@tests/helper/mock-helper.mock';
import { CreateCategoryRequest } from '@usecases/category/create-category-use-case';
import faker from 'faker';

export const makeCreateCategoryMock = (
  valueHasToBeReplaced?: Partial<CreateCategoryRequest>,
  replaceInsideListObject = false,
) =>
  changeValuesMock<CreateCategoryRequest>(
    {
      name: faker.datatype.string(32),
      description: faker.datatype.string(255),
    },
    valueHasToBeReplaced,
    replaceInsideListObject,
  );
