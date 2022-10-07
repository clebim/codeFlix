import { CategoryPlainProperties } from '@entities/category';
import { Video } from '@entities/video';
import { VideoRepository as VideoRepositoryContract } from '@usecases/video/port/video-repository';
import { Repository } from 'typeorm';

import { datasource } from '../index';
import { VideoSchema } from '../schemas/video';

export class VideoRepository implements VideoRepositoryContract {
  private repository: Repository<VideoSchema>;

  constructor() {
    this.repository = datasource.getRepository(VideoSchema);
  }

  async save(entity: Video): Promise<Video> {
    const videoSchema = this.repository.create(entity.toDTO());

    await this.repository.save(videoSchema);

    return entity;
  }
}
