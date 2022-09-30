import { CreateCategoryInput } from '@external/graphql/dtos/inputs/create-category-input';
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
    const controller = this.getController(
      this.injectionTokens.listCategoryController,
      this.containerVersion.V1,
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
    const controller = this.getController(
      this.injectionTokens.createCategoryController,
      this.containerVersion.V1,
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
}
