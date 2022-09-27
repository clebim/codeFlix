import { Request, Response, NextFunction } from 'express';

export const setupCors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-uuid, authorization, local-timezone',
  );
  res.header('Access-Control-Expose-Headers', 'Content-disposition');
  next();
};
