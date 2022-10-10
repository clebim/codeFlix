import { User, UserConstructorProperties } from '@entities/user';
import { changeValuesMock } from '@tests/helper/mock-helper.mock';
import faker from 'faker';

export const makeUserMock = (
  valueHasToBeReplaced?: Partial<UserConstructorProperties>,
  replaceInsideListObject = false,
) => {
  const body: UserConstructorProperties = {
    id: faker.datatype.uuid(),
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
