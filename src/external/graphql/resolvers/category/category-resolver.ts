import { CreateCategoryInput } from '@external/graphql/dtos/inputs/category/create-category-input';
import { UpdateCategoryInput } from '@external/graphql/dtos/inputs/category/update-category-input';
import { Category } from '@external/graphql/dtos/models/category';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Resolver as ResolverBase } from '../index';

@Resolver()
export class CategoryResolver extends ResolverBase {
  constructor() {
    super();
  }

  @Query(() => [Category])
  async getCategories(
    @Arg('name', { nullable: true }) name: string,
    @Arg('description', { nullable: true }) description: string,
    @Arg('createdAt', { nullable: true }) createdAt: string,
  ) {
    const controller = this.getControllerV1(
      this.injectionTokens.listCategoryController,
    );

    const { body, statusCode } = await controller.handle({
      query: {
        name,
        description,
        createdAt,
      },
    });

    if (statusCode !== 200) {
      this.buildError(statusCode, body.message ?? JSON.stringify(body));
    }

    return body.categories;
  }

  @Mutation(() => Category)
  async createCategory(@Arg('data') data: CreateCategoryInput) {
    const controller = this.getControllerV1(
      this.injectionTokens.createCategoryController,
    );

    const { body, statusCode } = await controller.handle({
      body: {
        name: data.name,
        description: data.description,
      },
    });

    if (statusCode !== 201) {
      this.buildError(statusCode, body.message ?? JSON.stringify(body));
    }

    return body;
  }

  @Mutation(() => Category)
  async updateCategory(@Arg('data') data: UpdateCategoryInput) {
    const controller = this.getControllerV1(
      this.injectionTokens.updateCategoryController,
    );

    const { body, statusCode } = await controller.handle({
      body: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      },
      params: {
        id: data.id,
      },
    });

    if (statusCode !== 200) {
      this.buildError(statusCode, body.message ?? JSON.stringify(body));
    }

    return body;
  }
}
