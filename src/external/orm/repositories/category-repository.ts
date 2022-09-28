import { Category, CategoryProperties } from '@entities/category';
import {
  CategoryRepository as CategoryRepositoryContract,
  GetUniqueCategoryOptions,
  ListCategoryOptions,
} from '@usecases/category/port/category-repository';

type CategoryRepositoryProperties = CategoryProperties & { id: string };

export class CategoryRepository implements CategoryRepositoryContract {
  private repository: CategoryRepositoryProperties[] = [];

  public async save(entity: Category): Promise<Category> {
    this.repository.push(entity.toDTO());
    return entity;
  }

  async getUniqueBy(whereOptions: GetUniqueCategoryOptions): Promise<Category> {
    const category = this.repository.find(
      category =>
        category.name === whereOptions.name ||
        category.description === whereOptions.description,
    );

    return category ? new Category(category) : undefined;
  }
  async listCategory(whereOptions: ListCategoryOptions): Promise<Category[]> {
    const { name, description, createdAt } = whereOptions;

    const categories = this.repository.filter(category => {
      if (
        name &&
        description &&
        name === category.name &&
        description === category.description &&
        createdAt &&
        createdAt === category.createdAt
      ) {
        return true;
      }

      if (
        name &&
        name === category.name &&
        createdAt &&
        createdAt === category.createdAt
      ) {
        return true;
      }

      if (
        description &&
        description === category.description &&
        createdAt &&
        createdAt === category.createdAt
      ) {
        return true;
      }

      if (
        name &&
        description &&
        name === category.name &&
        description === category.description
      ) {
        return true;
      }

      if (name && name === category.name) {
        return true;
      }

      if (description && description === category.description) {
        return true;
      }

      if (createdAt && createdAt === category.createdAt) {
        return true;
      }

      if (!name && !description && !createdAt) {
        return true;
      }

      return false;
    });

    return categories.map(category => new Category(category));
  }
}
