import { Category } from '@external/graphql/dtos/models/category';
import { Query, Resolver } from 'type-graphql';

import { Resolver as ResolverBase } from '../index';

@Resolver()
export class CategoryResolver extends ResolverBase {
  constructor() {
    super();
  }

  @Query(() => [Category])
  async getCategories() {
    const controller = this.getController(
      this.injectionTokens.listCategoryController,
      this.containerVersion.V1,
    );

    const { body, statusCode } = await controller.handle({ query: {} });

    if (statusCode !== 200) {
      this.buildError(
        statusCode,
        body.message ?? JSON.stringify(body, null, 2),
      );
    }

    return body.categories;
  }
}
