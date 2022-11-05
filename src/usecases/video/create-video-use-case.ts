import { Video } from '@entities/video';
import { VideoPlainProperties } from '@entities/video/interfaces/video-plain-properties';
import { UserRepository } from '@usecases/account/port/user-repository';
import { CategoryRepository } from '@usecases/category/port/category-repository';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UserNotFoundError } from '@usecases/errors/user/user-not-found';
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
  categoriesId: string[] | string;
};

export type CreateVideoResponse = Either<
  InvalidDataError | UserNotFoundError,
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
    @inject('VideoRepository')
    private videoRepository: VideoRepository,
    @inject('CategoryRepository')
    private categoryRepository: CategoryRepository,
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('CreateVideoValidator')
    private validator: RequestValidator<CreateVideoRequest>,
  ) {
    super();
  }

  async execute(request: CreateVideoRequest): Promise<CreateVideoResponse> {
    try {
      const { isValid, invalidFields } = this.validator.validate(request);

      if (!isValid) {
        return this.left(new InvalidDataError(invalidFields));
      }

      const { categoriesId, ...rest } = request;

      const user = await this.userRepository.getUniqueBy({
        id: rest.userId,
      });

      if (!user) {
        return this.left(new UserNotFoundError('User not found in api'));
      }

      let categories = [];

      if (categoriesId) {
        categories = await this.categoryRepository
          .listCategory({
            id: categoriesId,
            isActive: true,
          })
          .then(data => data.map(category => category.toDTO()));
      }

      const newVideo = new Video({
        ...rest,
        categories,
        user: user.toDTO(),
      });

      await this.videoRepository.save(newVideo);

      return this.right(newVideo.toDTO());
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
