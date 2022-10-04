import { zonedTimeToUtc } from 'date-fns-tz';

import { getLocalTimeZone } from '@shared/get-local-timezone';

import { Category, CategoryConstructorProperties } from './category';
import { Entity } from './entity';

export type VideoProperties = {
  userId: string;
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  public: boolean;
  categories: Category[];
  createdAt: Date;
};

type UpdateVideoProperties = {
  url?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  categories?: CategoryConstructorProperties[];
};

export type VideoConstructorProperties = Omit<
  VideoProperties,
  'categories' | 'createdAt' | 'public'
> & {
  id?: string;
  categories?: CategoryConstructorProperties[];
  public?: boolean;
  createdAt?: Date;
};

export class Video extends Entity<Video> {
  public readonly props: VideoProperties;

  constructor(props: VideoConstructorProperties) {
    const entityProperties = {
      ...props,
      url: props.url ?? null,
      public: props.public ?? true,
      description: props.description ?? null,
      thumbnail: props.thumbnail ?? null,
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

  public putAsPublic(): void {
    this.props.public = true;
  }

  public update(props: UpdateVideoProperties): void {
    const body: Partial<VideoProperties> = {
      title: props.title ?? this.props.title,
      url: props.url ?? this.props.url,
      description: props.description ?? this.props.description,
      thumbnail: props.thumbnail ?? this.props.thumbnail,
      categories: props.categories
        ? props.categories.map(category => new Category(category))
        : this.props.categories,
    };
    Object.assign(this.props, body);
  }

  public toDTO() {
    return this.classToPlain<VideoProperties>(this);
  }
}
