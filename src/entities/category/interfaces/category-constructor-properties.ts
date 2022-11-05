import { CategoryProperties } from './category-properties';

export type CategoryConstructorProperties = Omit<
  CategoryProperties,
  'createdAt'
> & {
  id?: string;
  createdAt?: Date;
};
