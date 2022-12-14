import { CategoryProperties } from '@entities/category/interfaces/category-properties';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { Either } from '@usecases/helpers/either';
import { RequestValidator } from '@usecases/port/request-validator';
import { UseCase } from '@usecases/port/use-case';
import { inject, injectable } from 'tsyringe';

import { LoggerMethods } from '@shared/logger';

import { CategoryRepository } from './port/category-repository';

export type ListCategoryRequest = {
  name?: string;
  id?: string | string[];
  description?: string;
  createdAt?: Date;
};

export type ListCategoryResponse = Either<
  InvalidDataError,
  CategoryProperties[]
>;

@injectable()
export class ListCategoryUseCase extends UseCase<
  ListCategoryRequest,
  ListCategoryResponse
> {
  constructor(
    @inject('Logger')
    private logger: LoggerMethods,
    @inject('CategoryRepository')
    private repository: CategoryRepository,
    @inject('ListCategoryValidator')
    private validator: RequestValidator<ListCategoryRequest>,
  ) {
    super();
  }

  async execute(request: ListCategoryRequest): Promise<ListCategoryResponse> {
    try {
      const { isValid, invalidFields } = this.validator.validate(request);

      if (!isValid) {
        return this.left(new InvalidDataError(invalidFields));
      }

      const categories = await this.repository.listCategory(request);

      return this.right(categories.map(category => category.toDTO()));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
