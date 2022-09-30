import env from 'dotenv';
import path from 'path';

import { envToString } from '@shared/env-to-string';

env.config({ path: path.resolve(`./env/.env.${process.env.NODE_ENV}`) });

process.env.ENVIRONMENT = process.env.ENVIRONMENT || process.env.NODE_ENV;

export const appConfig = {
  TEST: process.env.NODE_ENV === 'test',
  PROD: process.env.NODE_ENV === 'prod',
  DEV: process.env.NODE_ENV === 'dev',

  TIMEZONE: process.env.TIMEZONE,

  SERVER: {
    http: {
      port: Number(envToString('HTTP_PORT', '3333')),
      host: envToString('HTTP_HOST', '127.0.0.1'),
    },
  },
};
