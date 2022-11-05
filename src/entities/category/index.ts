import { Entity } from '@entities/entity';

import { convertZonedTimeToUtc } from '@shared/domain/zoned-time-to-utc';

import { CategoryConstructorProperties } from './interfaces/category-constructor-properties';
import { CategoryPlainProperties } from './interfaces/category-plain-properties';
import { CategoryProperties } from './interfaces/category-properties';
import { UpdateCategoryProperties } from './interfaces/update-category-properties';

export class Category extends Entity<CategoryProperties> {
  constructor(props: CategoryConstructorProperties) {
    const entityProperties = {
      ...props,
      isActive: props.isActive ?? true,
      description: props.description ?? null,
      createdAt: props.createdAt ?? convertZonedTimeToUtc(new Date()),
    };
    super(entityProperties);
  }

  public update(props: UpdateCategoryProperties): void {
    const body: Partial<CategoryProperties> = {
      name: props.name ?? this.props.name,
      description: props.description ?? this.props.description,
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
    return this.classToPlain<CategoryPlainProperties>(this);
  }
}
