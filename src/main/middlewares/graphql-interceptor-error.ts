import { appConfig } from '@main/config';
import { ApolloError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';

import { Logger } from '@shared/logger';

export const graphqlInterceptorError: MiddlewareFn<any> = async (_, next) => {
  const logger = new Logger();

  try {
    return await next();
  } catch (error) {
    logger.error(error);

    if (appConfig.PROD) {
      throw new ApolloError('Internal server error', 'Internal server error');
    }

    throw new ApolloError(error.message, error.code ?? 'DEFAULT-000');
  }
};
