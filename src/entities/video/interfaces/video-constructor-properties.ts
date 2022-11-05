import { CategoryConstructorProperties } from '@entities/category/interfaces/category-constructor-properties';
import { UserConstructorProperties } from '@entities/user/interfaces/user-constructor-properties';

import { VideoProperties } from './video-properties';

export type VideoConstructorProperties = Omit<
  VideoProperties,
  'categories' | 'createdAt' | 'public' | 'likes' | 'user'
> & {
  id?: string;
  categories?: CategoryConstructorProperties[];
  user: UserConstructorProperties;
  public?: boolean;
  likes?: number;
  createdAt?: Date;
};
