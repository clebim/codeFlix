import { Video, VideoPlainProperties } from '@entities/video';
import { CategoryRepository } from '@usecases/category/port/category-repository';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { Either } from '@usecases/helpers/either';
import { RequestValidator } from '@usecases/port/request-validator';
import { UseCase } from '@usecases/port/use-case';
import { inject, injectable } from 'tsyringe';

import { LoggerMethods } from '@shared/logger';

import { VideoRepository } from './port/video-repository';

export type CreateVideoRequest = {
  userId: string;
  filename: string;
  title: string;
  description?: string;
  thumbnail?: string;
  public?: boolean;
  categoriesId: string[];
};

export type CreateVideoResponse = Either<
  InvalidDataError,
  VideoPlainProperties
>;

@injectable()
export class CreateVideoUseCase extends UseCase<
  CreateVideoRequest,
  CreateVideoResponse
> {
  constructor(
    @inject('Logger')
    private logger: LoggerMethods,
    @inject('VideoRespository')
    private videoRepository: VideoRepository,
    @inject('CategoryReposotory')
    private categoryRepository: CategoryRepository,
    @inject('CreateVideoValidator')
    private validator: RequestValidator<CreateVideoRequest>,
  ) {
    super();
  }

  async execute(request: CreateVideoRequest): Promise<CreateVideoResponse> {
    try {
      const { isValid, invalidFields } = this.validator.validate(request);

      if (!isValid) {
        throw new InvalidDataError(invalidFields);
      }

      let categories = [];

      if (categories.length > 0) {
        categories = await this.categoryRepository
          .listCategory({
            id: request.categoriesId,
          })
          .then(data =>
            data
              .map(category => category.toDTO())
              .filter(category => category.isActive === true),
          );
      }

      const newVideo = new Video({
        categories,
        ...request,
      });

      await this.videoRepository.save(newVideo);

      return this.right(newVideo.toDTO());
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
