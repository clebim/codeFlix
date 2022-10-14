import { VideoPlainProperties } from '@entities/video';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { Either } from '@usecases/helpers/either';
import { RequestValidator } from '@usecases/port/request-validator';
import { UseCase } from '@usecases/port/use-case';
import { subDays } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { convertZonedTimeToUtc } from '@shared/domain/zoned-time-to-utc';
import { LoggerMethods } from '@shared/logger';

import { VideoRepository } from './port/video-repository';

export type ListVideosRequest = {
  page?: number;
  totalItemsPerPage?: number;
  order?: 'ASC' | 'DESC';
  orderBy?: string;
  initialDate?: Date;
  finalDate?: Date;
  title?: string;
  userId?: string;
  categories?: string[];
};

export type ListVideosResponseProperties = {
  page: number;
  totalItemsPerPage: number;
  totalPages: number;
  totalItems: number;
  videos: VideoPlainProperties[];
};

export type ListVideosResponse = Either<
  InvalidDataError,
  ListVideosResponseProperties
>;

@injectable()
export class ListVideosUseCase extends UseCase<
  ListVideosRequest,
  ListVideosResponse
> {
  constructor(
    @inject('Logger')
    private logger: LoggerMethods,
    @inject('VideoRepository')
    private videoRepository: VideoRepository,
    @inject('ListVideosValidator')
    private validator: RequestValidator<ListVideosRequest>,
  ) {
    super();
  }

  async execute(request: ListVideosRequest): Promise<ListVideosResponse> {
    try {
      const { isValid, invalidFields } = this.validator.validate(request);

      if (!isValid) {
        return this.left(new InvalidDataError(invalidFields));
      }

      const page = request.page ?? 1;
      const itemsPerPage = request.totalItemsPerPage ?? 10;
      const initialDate =
        request.initialDate ?? convertZonedTimeToUtc(subDays(new Date(), 7));
      const finalDate = request.finalDate ?? convertZonedTimeToUtc(new Date());
      const order = request.order ?? 'DESC';
      const orderBy = request.orderBy ?? 'likes';
      const skip = itemsPerPage * (page - 1);

      const { videos, count } = await this.videoRepository.listVideos({
        finalDate,
        initialDate,
        order,
        orderBy,
        skip,
        take: itemsPerPage,
        title: request.title,
        userId: request.userId,
        categories: request.categories,
      });

      const totalPages = Math.ceil(count / itemsPerPage);

      const response: ListVideosResponseProperties = {
        videos: videos.map(video => video.toDTO()),
        totalItems: count,
        totalItemsPerPage: itemsPerPage,
        page,
        totalPages,
      };

      return this.right(response);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
