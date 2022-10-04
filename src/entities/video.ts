import { zonedTimeToUtc } from 'date-fns-tz';

import { getLocalTimeZone } from '@shared/get-local-timezone';

import { Category, CategoryConstructorProperties } from './category';
import { Entity } from './entity';

export type VideoProperties = {
  userId: string;
  url: string;
  title: string;
  categories: Category[];
  createdAt: Date;
};

type UpdateVideoProperties = {
  url?: string;
  title?: string;
  categories?: CategoryConstructorProperties[];
};

export type VideoConstructorProperties = Omit<
  VideoProperties,
  'categories' | 'createdAt'
> & {
  id?: string;
  categories?: CategoryConstructorProperties[];
  createdAt?: Date;
};

export class Video extends Entity<Video> {
  public readonly props: VideoProperties;

  constructor(props: VideoConstructorProperties) {
    const entityProperties = {
      ...props,
      categories: props.categories.map(category => new Category(category)),
      createdAt:
        props.createdAt ?? zonedTimeToUtc(new Date(), getLocalTimeZone()),
    };
    delete entityProperties.id;
    super(props.id);
    this.props = entityProperties;
  }

  public update(props: UpdateVideoProperties): void {
    const body: Partial<VideoProperties> = {
      title: props.title ?? this.props.title,
      url: props.url ?? this.props.url,
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
