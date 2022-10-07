import { zonedTimeToUtc } from 'date-fns-tz';

import { getLocalTimeZone } from '@shared/get-local-timezone';

import {
  Category,
  CategoryConstructorProperties,
  CategoryPlainProperties,
} from './category';
import { Entity } from './entity';

export type VideoProperties = {
  userId: string;
  filename: string;
  title: string;
  description?: string;
  thumbnail?: string;
  public: boolean;
  likes: number;
  categories: Category[];
  createdAt: Date;
};

export type VideoPlainProperties = Omit<VideoProperties, 'categories'> & {
  categories: CategoryPlainProperties[];
};

type UpdateVideoProperties = {
  filename?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  categories?: CategoryConstructorProperties[];
};

export type VideoConstructorProperties = Omit<
  VideoProperties,
  'categories' | 'createdAt' | 'public' | 'likes'
> & {
  id?: string;
  categories?: CategoryConstructorProperties[];
  public?: boolean;
  likes?: number;
  createdAt?: Date;
};

export class Video extends Entity<Video> {
  public readonly props: VideoProperties;

  constructor(props: VideoConstructorProperties) {
    const entityProperties = {
      ...props,
      filename: props.filename ?? null,
      public: props.public ?? true,
      description: props.description ?? null,
      thumbnail: props.thumbnail ?? null,
      likes: props.likes ?? 0,
      categories: props.categories.map(category => new Category(category)),
      createdAt:
        props.createdAt ?? zonedTimeToUtc(new Date(), getLocalTimeZone()),
    };
    delete entityProperties.id;
    super(props.id);
    this.props = entityProperties;
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
