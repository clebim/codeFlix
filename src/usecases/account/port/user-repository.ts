import { User } from '@entities/user';

export type GetUniqueUserOptions = {
  name?: string;
  email?: string;
  id?: string;
};

export type RelationOptions = 'videos';

export interface UserRepository {
  save(entity: User): Promise<User>;
  getUniqueBy(
    whereOptions: GetUniqueUserOptions,
    relations?: RelationOptions[],
  ): Promise<User | undefined>;
}
