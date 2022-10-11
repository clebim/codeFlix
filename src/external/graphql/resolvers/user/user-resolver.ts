import { CreateUserInput } from '@external/graphql/dtos/inputs/user/create-user-input';
import { User } from '@external/graphql/dtos/models/user';
import { Video } from '@external/graphql/dtos/models/video';
import { Arg, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';

import { Resolver as ResolverBase } from '../index';

@Resolver(() => User)
export class UserResolver extends ResolverBase {
  constructor() {
    super();
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: CreateUserInput) {
    const controller = this.getControllerV1(
      this.injectionTokens.createUserController,
    );

    const { body, statusCode } = await controller.handle({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      },
    });

    if (statusCode !== 201) {
      this.buildError(statusCode, body.message ?? JSON.stringify(body));
    }

    return body;
  }

  @FieldResolver(() => [Video])
  async videos(@Root() user: User) {
    return {
      ...user.videos,
    };
  }
}
