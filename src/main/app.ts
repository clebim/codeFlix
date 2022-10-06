import express, { Express } from 'express';

import { setupGraphql } from './graphql';
import { setupHealthCheck } from './health-check';
import { setupMiddlewares } from './middlewares';
import { handlerError } from './middlewares/handler-error';
import { setupProviders } from './providers';
import { setupRoutes } from './routes';

import '@external/dependency-injection';

export const app = async (): Promise<Express> => {
  const expressApp = express();
  setupHealthCheck(expressApp);
  setupProviders();
  setupMiddlewares(expressApp);
  setupGraphql(expressApp);
  setupRoutes(expressApp);
  expressApp.use(handlerError);
  return expressApp;
};
