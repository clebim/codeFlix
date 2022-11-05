import { CategoryPlainProperties } from '@entities/category/interfaces/category-plain-properties';
import { UserPlainProperties } from '@entities/user/interfaces/user-plain-properties';

import { VideoProperties } from './video-properties';

export type VideoPlainProperties = Omit<
  VideoProperties,
  'categories' | 'user'
> & {
  id: string;
  categories: CategoryPlainProperties[];
  user: UserPlainProperties;
};
