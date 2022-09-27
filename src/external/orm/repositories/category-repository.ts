import { Category, CategoryProperties } from '@entities/category';
import { CategoryRepository as CategoryRepositoryContract } from '@usecases/category/port/category-repostitory';

export class CategoryRepositoryImpl implements CategoryRepositoryContract {
  private repostitory: CategoryProperties[] = [];

  public async save(entity: Category): Promise<Category> {
    this.repostitory.push(entity.toDTO());
    return entity;
  }
}
