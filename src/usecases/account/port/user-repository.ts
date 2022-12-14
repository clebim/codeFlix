import { User } from '@entities/user/index';

export type GetUniqueUserOptions = {
  name?: string;
  email?: string;
  id?: string;
};

export type RelationOptions = Array<'videos' | 'videos.categories'>;

export interface UserRepository {
  save(entity: User): Promise<User>;
  getUniqueBy(
    whereOptions: GetUniqueUserOptions,
    relations?: RelationOptions,
  ): Promise<User | undefined>;
}
