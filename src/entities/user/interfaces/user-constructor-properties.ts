import { VideoConstructorProperties } from '@entities/video/interfaces/video-constructor-properties';

import { UserProperties } from './user-properties';

export type UserConstructorProperties = Omit<
  UserProperties,
  'id' | 'createdAt' | 'isActive' | 'videos'
> & {
  id?: string;
  videos?: VideoConstructorProperties[];
  createdAt?: Date;
  isActive?: boolean;
};
