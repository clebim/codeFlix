import { Entity } from '@entities/entity';
import { zonedTimeToUtc } from 'date-fns-tz';

import { getLocalTimeZone } from '@shared/get-local-timezone';

export type CategoryProperties = {
  id?: string;
  name: string;
  isActive?: boolean;
  description?: string;
  createdAt?: Date;
};

type UpdateCategoryProperties = Omit<CategoryProperties, 'createdAt'>;

export class Category extends Entity<Category> {
  constructor(public readonly props: CategoryProperties) {
    const entityProperties = {
      ...props,
      isActive: props.isActive ?? true,
      description: props.description ?? null,
      createdAt:
        props.createdAt ?? zonedTimeToUtc(new Date(), getLocalTimeZone()),
    };
    delete entityProperties.id;
    super(props.id);
    this.props = entityProperties;
  }

  public update(props: UpdateCategoryProperties): void {
    const body = {
      name: props.name ?? this.props.name,
      descrption: props.description ?? this.props.description,
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
    return this.classToPlain<CategoryProperties>(this);
  }
}
