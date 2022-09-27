import express, { IRouter, Express } from 'express';
import fs from 'fs';
import path from 'path';

const routes: IRouter = express.Router();

const buildRouter = (startPath: string) => {
  fs.readdirSync(startPath).map(async file => {
    const filename = path.join(startPath, file);
    const stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      buildRouter(filename);
    }

    if (file.includes('router.ts')) {
      const routeBuilder = (await import(filename)).default;
      routeBuilder(routes);
    }

    if (file.includes('router.js') && path.extname(file) === '.js') {
      // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
      const routeBuilder = require(filename).default;
      routeBuilder(routes);
    }
  });
};

export const setupRoutes = (app: Express): void => {
  buildRouter(__dirname);
  app.use('/api', routes);
};
