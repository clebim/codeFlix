import { Category } from '@entities/category';
import { User } from '@entities/user/index';

export type VideoProperties = {
  userId: string;
  filename: string;
  title: string;
  description?: string;
  thumbnail?: string;
  public: boolean;
  likes: number;
  categories: Category[];
  user: User;
  createdAt: Date;
};
