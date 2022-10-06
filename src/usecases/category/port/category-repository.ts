import { Category } from '@entities/category';

export type GetUniqueCategoryOptions = {
  name?: string;
  description?: string;
  id?: string;
};

export type ListCategoryOptions = {
  id?: string | string[];
  name?: string;
  description?: string;
  createdAt?: Date;
};
export interface CategoryRepository {
  save(entity: Category): Promise<Category>;
  getUniqueBy(
    whereOptions: GetUniqueCategoryOptions,
  ): Promise<Category | undefined>;
  listCategory(whereOptions?: ListCategoryOptions): Promise<Category[]>;
}
