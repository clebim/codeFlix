import { CategoryConstructorProperties } from '@entities/category/interfaces/category-constructor-properties';

export type UpdateVideoProperties = {
  filename?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  categories?: CategoryConstructorProperties[];
};
