import express, { Express } from 'express';

import { setupCors } from './cors';

export const setupMiddlewares = (app: Express): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(setupCors);
};
