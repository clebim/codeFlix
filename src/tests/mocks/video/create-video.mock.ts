import { changeValuesMock } from '@tests/helper/mock-helper.mock';
import { CreateVideoRequest } from '@usecases/video/create-video-use-case';
import faker from 'faker';

export const makeCreateVideoMock = (
  valueHasToBeReplaced?: Partial<CreateVideoRequest>,
  replaceInsideListObject = false,
) =>
  changeValuesMock<CreateVideoRequest>(
    {
      categoriesId: [faker.datatype.uuid(), faker.datatype.uuid()],
      filename: faker.datatype.string(),
      title: faker.datatype.string(),
      userId: faker.datatype.uuid(),
      description: faker.datatype.string(),
      public: true,
      thumbnail: faker.datatype.string(),
    },
    valueHasToBeReplaced,
    replaceInsideListObject,
  );
