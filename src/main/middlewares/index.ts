import express, { Express } from 'express';

import { setupCors } from './express/cors';

export const setupMiddlewares = (app: Express): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(setupCors);
};
