import { changeValuesMock } from '@tests/helper/mock-helper.mock';
import { UpdateCategoryRequest } from '@usecases/category/update-category-use-case';
import faker from 'faker';

export const makeUpdateCategoryMock = (
  valueHasToBeReplaced?: Partial<UpdateCategoryRequest>,
  replaceInsideListObject = false,
) =>
  changeValuesMock<UpdateCategoryRequest>(
    {
      id: faker.datatype.uuid(),
      name: faker.datatype.string(32),
      description: faker.datatype.string(255),
      isActive: faker.datatype.boolean(),
    },
    valueHasToBeReplaced,
    replaceInsideListObject,
  );
