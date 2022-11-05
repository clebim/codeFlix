import { convertZonedTimeToUtc } from '@shared/domain/zoned-time-to-utc';

import { Entity } from '../entity';
import { Video } from '../video';
import { UpdateUserProperties } from './interfaces/update-user-properties';
import { UserConstructorProperties } from './interfaces/user-constructor-properties';
import { UserPlainProperties } from './interfaces/user-plain-properties';
import { UserProperties } from './interfaces/user-properties';

export class User extends Entity<UserProperties> {
  constructor(props: UserConstructorProperties) {
    const entityProperties = {
      ...props,
      password: props.password ?? null,
      photo: props?.photo ?? null,
      isActive: props?.isActive ?? true,
      videos: props.videos ? props.videos.map(video => new Video(video)) : [],
      createdAt: props.createdAt ?? convertZonedTimeToUtc(new Date()),
    };
    super(entityProperties);
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
