import { User } from '@entities/user';

export type GetUniqueUserOptions = {
  name?: string;
  email?: string;
  id?: string;
};
export interface UserRepository {
  save(entity: User): Promise<User>;
  getUniqueBy(
    whereOptions: GetUniqueUserOptions,
    includes?: ['videos'],
  ): Promise<User | undefined>;
}
