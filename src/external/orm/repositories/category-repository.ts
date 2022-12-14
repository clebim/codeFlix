import { Category } from '@entities/category';
import {
  CategoryRepository as CategoryRepositoryContract,
  GetUniqueCategoryOptions,
  ListCategoryOptions,
} from '@usecases/category/port/category-repository';
import { Repository } from 'typeorm';

import { datasource } from '../index';
import { CategorySchema } from '../schemas/category';

export class CategoryRepository implements CategoryRepositoryContract {
  private repository: Repository<CategorySchema>;

  constructor() {
    this.repository = datasource.getRepository(CategorySchema);
  }

  public async save(entity: Category): Promise<Category> {
    const categotySchema = this.repository.create(entity.toDTO());

    await this.repository.save(categotySchema);

    return entity;
  }

  async getUniqueBy(whereOptions: GetUniqueCategoryOptions): Promise<Category> {
    const category = await this.repository.findOneBy(whereOptions);

    return category ? new Category(category) : undefined;
  }

  async listCategory(whereOptions: ListCategoryOptions): Promise<Category[]> {
    const { name, description, createdAt, id, isActive } = whereOptions;

    const queryBuilder = await this.repository
      .createQueryBuilder('category')
      .where('category.id is not null');

    if (id) {
      if (Array.isArray(id)) {
        queryBuilder.andWhereInIds(id);
      } else {
        queryBuilder.andWhere('category.id = :id', { id });
      }
    }

    if (name) {
      queryBuilder.andWhere('category.name like :name', { name: `%${name}%` });
    }

    if (description) {
      queryBuilder.andWhere('category.description like :description', {
        description: `%${description}%`,
      });
    }

    if (isActive) {
      queryBuilder.andWhere('category.isActive = :isActive', { isActive });
    }

    if (createdAt) {
      queryBuilder.andWhere('category.createdAt = :createdAt', { createdAt });
    }

    const categories = await queryBuilder.getMany();

    return categories.map(category => new Category(category));
  }
}
