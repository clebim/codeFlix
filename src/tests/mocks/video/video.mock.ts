import { Video, VideoConstructorProperties } from '@entities/video';
import { changeValuesMock } from '@tests/helper/mock-helper.mock';
import faker from 'faker';

import { makeCreateCategoryMock } from '../category/create-category.mock';

export const makeVideoMock = (
  valueHasToBeReplaced?: Partial<VideoConstructorProperties>,
  replaceInsideListObject = false,
) => {
  const body: VideoConstructorProperties = {
    filename: faker.datatype.string(),
    title: faker.datatype.string(),
    userId: faker.datatype.uuid(),
    categories: [makeCreateCategoryMock(), makeCreateCategoryMock()],
    description: faker.datatype.string(),
    likes: 0,
    public: true,
    thumbnail: faker.datatype.string(),
  };

  return new Video(
    changeValuesMock<VideoConstructorProperties>(
      body,
      valueHasToBeReplaced,
      replaceInsideListObject,
    ),
  );
};
