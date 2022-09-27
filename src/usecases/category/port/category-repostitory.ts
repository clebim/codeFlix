import { Category } from '@entities/category';

export interface CategoryRepository {
  save(entity: Category): Promise<Category>;
}
