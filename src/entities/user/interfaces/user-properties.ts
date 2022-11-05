import { Video } from '@entities/video';

export type UserProperties = {
  name: string;
  email: string;
  password: string;
  photo?: string;
  isActive: boolean;
  videos?: Video[];
  createdAt: Date;
};
