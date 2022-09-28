import { Category } from '@entities/category';

export type GetUniqueCategoryOptions = {
  name?: string;
  description?: string;
};

export type ListCategoryOptions = {
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
