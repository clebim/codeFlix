import { VideoPlainProperties } from '@entities/video';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { Either } from '@usecases/helpers/either';
import { UseCase } from '@usecases/port/use-case';

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

export class CreateVideoUseCase extends UseCase<
  CreateVideoRequest,
  CreateVideoResponse
> {
  async execute(request: CreateVideoRequest): Promise<CreateVideoResponse> {
    throw new Error('Method not implemented.');
  }
}
