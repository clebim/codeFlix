import faker from 'faker';

import { User, UserConstructorProperties } from './user';

describe('User Tests', () => {
  it('Test Constructor of User', () => {
    const props: UserConstructorProperties = {
      name: faker.datatype.string(),
      password: faker.datatype.string(),
      photo: faker.datatype.string(),
      email: faker.internet.email(),
    };

    const user = new User(props);

    expect(user.id).toBeTruthy();
    expect(user.props).toHaveProperty('name');
    expect(user.props).toHaveProperty('photo');
    expect(user.props).toHaveProperty('password');
    expect(user.props).toHaveProperty('createdAt');
    expect(user.props.isActive).toBeTruthy();
  });

  it('Test update user properties', () => {
    const props: UserConstructorProperties = {
      name: faker.datatype.string(),
      password: faker.datatype.string(),
      photo: faker.datatype.string(),
      email: faker.internet.email(),
    };

    const user = new User(props);

    user.update({
      name: 'Test Name',
      photo: 'profile photo',
      password: 'password',
    });

    expect(user.props.name).toEqual('Test Name');
    expect(user.props.photo).toEqual('profile photo');
    expect(user.props.password).toEqual('password');
  });
});
