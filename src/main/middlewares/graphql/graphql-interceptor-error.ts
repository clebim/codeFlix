import { ApolloError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';

import { Logger } from '@shared/logger';

export const graphqlInterceptorError: MiddlewareFn<any> = async (_, next) => {
  const logger = new Logger();

  try {
    return await next();
  } catch (error) {
    logger.error(error);

    if (!(error instanceof ApolloError)) {
      throw new ApolloError(error.message, error.code ?? 'DEFAULT-000');
    }

    throw error;
  }
};
