import { CategoryProperties } from '@entities/category/interfaces/category-properties';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { NotFoundError } from '@usecases/errors/not-found-error';
import { Either } from '@usecases/helpers/either';
import { RequestValidator } from '@usecases/port/request-validator';
import { UseCase } from '@usecases/port/use-case';
import { inject, injectable } from 'tsyringe';

import { LoggerMethods } from '@shared/logger';

import { CategoryRepository } from './port/category-repository';

export type UpdateCategoryRequest = {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateCategoryResponse = Either<
  InvalidDataError | NotFoundError,
  CategoryProperties
>;

@injectable()
export class UpdateCategoryUseCase extends UseCase<
  UpdateCategoryRequest,
  UpdateCategoryResponse
> {
  constructor(
    @inject('Logger')
    private logger: LoggerMethods,
    @inject('CategoryRepository')
    private repository: CategoryRepository,
    @inject('UpdateCategoryValidator')
    private validator: RequestValidator<UpdateCategoryRequest>,
  ) {
    super();
  }

  async execute(
    request: UpdateCategoryRequest,
  ): Promise<UpdateCategoryResponse> {
    try {
      const { invalidFields, isValid } = this.validator.validate(request);
      const { id, isActive, name, description } = request;

      if (!isValid) {
        return this.left(new InvalidDataError(invalidFields));
      }

      const categoryExists = await this.repository.getUniqueBy({ id });

      if (!categoryExists) {
        return this.left(
          new NotFoundError(`Category with id: ${id} not found in api`),
        );
      }

      if (isActive !== undefined && isActive === false) {
        categoryExists.deactivate();
      }

      if (isActive !== undefined && isActive === true) {
        categoryExists.activate();
      }

      categoryExists.update({
        name,
        description,
      });

      await this.repository.save(categoryExists);

      return this.right(categoryExists.toDTO());
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
