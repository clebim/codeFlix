import { changeValuesMock } from '@tests/helper/mock-helper.mock';
import { CreateUserRequest } from '@usecases/account/create-user-use-case';
import faker from 'faker';

export const makeCreateUserMock = (
  valueHasToBeReplaced?: Partial<CreateUserRequest>,
  replaceInsideListObject = false,
) => {
  const password = faker.datatype.string(16);

  return changeValuesMock<CreateUserRequest>(
    {
      email: faker.internet.email(),
      name: faker.datatype.string(),
      password,
      passwordConfirmation: password,
    },
    valueHasToBeReplaced,
    replaceInsideListObject,
  );
};
