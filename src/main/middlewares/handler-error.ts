import { appConfig } from '@main/config';
import { NextFunction, Request, Response } from 'express';

import { Logger } from '@shared/logger';

const logger = new Logger();

export const handlerError = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  logger.error(err);

  if (appConfig.PROD) {
    res.status(500).json({
      code: 'SERVER-000',
      message: 'Internal server error',
    });
    return;
  }

  res.status(500).json({
    code: 'SERVER-000',
    message: err.message,
    stack: err.stack,
    exception: err,
  });
};
