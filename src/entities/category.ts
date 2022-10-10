import { Entity } from '@entities/entity';

import { convertZonedTimeToUtc } from '@shared/domain/zoned-time-to-utc';

export type CategoryProperties = {
  name: string;
  isActive?: boolean;
  description?: string;
  createdAt: Date;
};

type UpdateCategoryProperties = {
  name?: string;
  description?: string;
};

export type CategoryConstructorProperties = Omit<
  CategoryProperties,
  'createdAt'
> & {
  id?: string;
  createdAt?: Date;
};

export type CategoryPlainProperties = CategoryProperties & { id: string };

export class Category extends Entity<Category> {
  public readonly props: CategoryProperties;

  constructor(props: CategoryConstructorProperties) {
    const entityProperties = {
      ...props,
      isActive: props.isActive ?? true,
      description: props.description ?? null,
      createdAt: props.createdAt ?? convertZonedTimeToUtc(new Date()),
    };
    delete entityProperties.id;
    super(props.id);
    this.props = entityProperties;
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
