import { Category } from '@entities/category';
import { CategoryProperties } from '@entities/category/interfaces/category-properties';
import { CategoryAlreadyExistsError } from '@usecases/errors/category/category-already-exists-error';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { Either } from '@usecases/helpers/either';
import { RequestValidator } from '@usecases/port/request-validator';
import { injectable, inject } from 'tsyringe';

import { LoggerMethods } from '@shared/logger';

import { UseCase } from '../port/use-case';
import { CategoryRepository } from './port/category-repository';

export type CreateCategoryRequest = {
  name: string;
  description?: string;
};

export type CreateCategoryResponse = Either<
  InvalidDataError | CategoryAlreadyExistsError,
  CategoryProperties
>;

@injectable()
export class CreateCategoryUseCase extends UseCase<
  CreateCategoryRequest,
  CreateCategoryResponse
> {
  constructor(
    @inject('Logger')
    private logger: LoggerMethods,
    @inject('CategoryRepository')
    private repository: CategoryRepository,
    @inject('CreateCategoryValidator')
    private validator: RequestValidator<CreateCategoryRequest>,
  ) {
    super();
  }

  async execute(
    request: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> {
    try {
      const { isValid, invalidFields } = this.validator.validate(request);

      if (!isValid) {
        return this.left(new InvalidDataError(invalidFields));
      }

      const categoryAlreadyExists = await this.repository.getUniqueBy({
        name: request.name,
      });

      if (categoryAlreadyExists) {
        return this.left(new CategoryAlreadyExistsError());
      }

      const category = new Category(request);

      await this.repository.save(category);

      return this.right(category.toDTO());
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
