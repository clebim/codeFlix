import { Category } from '@entities/category';

import { convertZonedTimeToUtc } from '@shared/domain/zoned-time-to-utc';

import { Entity } from '../entity';
import { User } from '../user';
import { UpdateVideoProperties } from './interfaces/update-video-properties';
import { VideoConstructorProperties } from './interfaces/video-constructor-properties';
import { VideoPlainProperties } from './interfaces/video-plain-properties';
import { VideoProperties } from './interfaces/video-properties';

export class Video extends Entity<VideoProperties> {
  constructor(props: VideoConstructorProperties) {
    const entityProperties = {
      ...props,
      filename: props.filename ?? null,
      public: props.public ?? true,
      description: props.description ?? null,
      thumbnail: props.thumbnail ?? null,
      likes: props.likes ?? 0,
      user: props.user ? new User(props.user) : null,
      categories: props.categories
        ? props.categories.map(category => new Category(category))
        : [],
      createdAt: props.createdAt ?? convertZonedTimeToUtc(new Date()),
    };
    super(entityProperties);
  }

  public putAsPrivate(): void {
    this.props.public = false;
  }

  public addLike(): void {
    this.props.likes += 1;
  }

  public removeLike(): void {
    this.props.likes -= 1;
  }

  public putAsPublic(): void {
    this.props.public = true;
  }

  public update(props: UpdateVideoProperties): void {
    const body: Partial<VideoProperties> = {
      title: props.title ?? this.props.title,
      filename: props.filename ?? this.props.filename,
      description: props.description ?? this.props.description,
      thumbnail: props.thumbnail ?? this.props.thumbnail,
      categories: props.categories
        ? props.categories.map(category => new Category(category))
        : this.props.categories,
    };
    Object.assign(this.props, body);
  }

  public toDTO() {
    return this.classToPlain<VideoPlainProperties>(this);
  }
}
