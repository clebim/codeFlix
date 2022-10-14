import { Video } from '@entities/video';

export type ListVideoOptions = {
  initialDate?: Date;
  finalDate?: Date;
  title?: string;
  userId?: string;
  order?: 'ASC' | 'DESC';
  orderBy?: string;
  skip?: number;
  take?: number;
  includes?: Array<'categories' | 'user'>;
  categories?: string[];
};

export type ListVideo = {
  videos: Video[];
  count: number;
};
export interface VideoRepository {
  save(entity: Video): Promise<Video>;
  listVideos(options: ListVideoOptions): Promise<ListVideo>;
}
