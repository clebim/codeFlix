import { User } from '@entities/user/index';
import { UserConstructorProperties } from '@entities/user/interfaces/user-constructor-properties';
import { changeValuesMock } from '@tests/helper/mock-helper.mock';
import faker from 'faker';

export const makeUserMock = (
  valueHasToBeReplaced?: Partial<UserConstructorProperties>,
  replaceInsideListObject = false,
) => {
  const body: UserConstructorProperties = {
    email: faker.internet.email(),
    password: faker.datatype.string(),
    photo: faker.datatype.string(),
    isActive: true,
    name: faker.datatype.string(),
    videos: [],
    createdAt: faker.date.recent(),
  };

  return new User(
    changeValuesMock<UserConstructorProperties>(
      body,
      valueHasToBeReplaced,
      replaceInsideListObject,
    ),
  );
};
