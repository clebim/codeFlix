import { User } from '@entities/user';
import {
  GetUniqueUserOptions,
  RelationOptions,
  UserRepository as UserRepositoryContract,
} from '@usecases/account/port/user-repository';
import { Repository } from 'typeorm';

import { datasource } from '../index';
import { UserSchema } from '../schemas/user';

export class UserRepository implements UserRepositoryContract {
  private repository: Repository<UserSchema>;

  constructor() {
    this.repository = datasource.getRepository(UserSchema);
  }

  async save(entity: User): Promise<User> {
    const dto = entity.toDTO();

    delete dto.videos;

    const userSchema = this.repository.create(dto);

    await this.repository.save(userSchema);

    return entity;
  }

  async getUniqueBy(
    whereOptions: GetUniqueUserOptions,
    relations: RelationOptions = [],
  ): Promise<User> {
    const user = await this.repository.findOne({
      where: whereOptions,
      relations,
    });

    delete user.password;

    return user ? new User(user) : undefined;
  }
}
