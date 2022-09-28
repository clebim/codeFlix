import { Entity } from '@entities/entity';

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
      createdAt: props.createdAt ?? new Date(),
    };
    delete entityProperties.id;
    super(props.id);
    this.props = entityProperties;
  }

  public update(props: UpdateCategoryProperties): void {
    Object.assign(this.props, props);
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
