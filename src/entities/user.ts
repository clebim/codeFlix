import { convertZonedTimeToUtc } from '@shared/domain/zoned-time-to-utc';

import { Entity } from './entity';
import {
  Video,
  VideoConstructorProperties,
  VideoPlainProperties,
} from './video';

export type UserProperties = {
  name: string;
  email: string;
  password: string;
  photo?: string;
  isActive: boolean;
  videos?: Video[];
  createdAt: Date;
};

export type UserPlainProperties = UserProperties & {
  id: string;
  videos?: VideoPlainProperties[];
};

export type UserConstructorProperties = Omit<
  UserProperties,
  'id' | 'createdAt' | 'isActive' | 'videos'
> & {
  id?: string;
  videos?: VideoConstructorProperties[];
  createdAt?: Date;
  isActive?: boolean;
};

export type UpdateUserProperties = {
  name?: string;
  password?: string;
  photo?: string;
};

export class User extends Entity<User> {
  public readonly props: UserProperties;

  constructor(props: UserConstructorProperties) {
    const entityProperties = {
      ...props,
      password: props.password ?? null,
      photo: props?.photo ?? null,
      isActive: props?.isActive ?? true,
      videos: props.videos ? props.videos.map(video => new Video(video)) : [],
      createdAt: props.createdAt ?? convertZonedTimeToUtc(new Date()),
    };
    delete entityProperties.id;
    super(props.id);
    this.props = entityProperties;
  }

  public update(props: UpdateUserProperties): void {
    const body: Partial<UpdateUserProperties> = {
      name: props.name ?? this.props.name,
      password: props.password ?? this.props.password,
      photo: props.photo ?? this.props.photo,
    };
    Object.assign(this.props, body);
  }

  public activate(): void {
    this.props.isActive = true;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public toDTO() {
    return this.classToPlain<UserPlainProperties>(this);
  }
}
