import { Video } from '@entities/video';

export interface VideoRepository {
  save(entity: Video): Promise<Video>;
}
