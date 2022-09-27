import { envToString } from '@shared/env-to-string';

export const appConfig = {
  TEST: process.env.NODE_ENV === 'test',
  PROD: process.env.NODE_ENV === 'prod',

  LOCALTIMEZONE: process.env.LOCALTIMEZONE,

  SERVER: {
    http: {
      port: Number(envToString('HTTP_PORT', '3333')),
      host: envToString('HTTP_HOST', '127.0.0.1'),
    },
  },
};
