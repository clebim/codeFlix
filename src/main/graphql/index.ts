import 'reflect-metadata';
import { resolvers } from '@external/graphql';
import { appConfig } from '@main/config';
import { graphqlInterceptorError } from '@main/middlewares/graphql-interceptor-error';
import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import path from 'path';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';

import { Logger } from '@shared/logger';

const logger = new Logger();

export const schemaOptions: BuildSchemaOptions = {
  resolvers,
  emitSchemaFile: path.resolve(
    __dirname,
    '..',
    '..',
    'external',
    'graphql',
    'schema.gql',
  ),
  globalMiddlewares: [graphqlInterceptorError],
};

export const setupGraphql = async (expressApp: Express) => {
  const schema = await buildSchema(schemaOptions);
  const server = new ApolloServer({ schema, debug: appConfig.DEV });
  const path = '/api/graphql';
  const { host } = appConfig.SERVER.http;
  const { port } = appConfig.SERVER.http;
  await server.start();
  server.applyMiddleware({ app: expressApp, path });

  logger.info(
    `\x1b[32m Graphql apollo server running in http://${host}:${port}${server.graphqlPath}\x1b[37m`,
  );
};
