import { VideoPlainProperties } from '@entities/video/interfaces/video-plain-properties';

import { UserProperties } from './user-properties';

export type UserPlainProperties = UserProperties & {
  id: string;
  videos?: VideoPlainProperties[];
};
