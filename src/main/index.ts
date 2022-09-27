import express, { Express, Request, Response } from 'express';

export const setupHealthCheck = (app: Express): void => {
  const actuator = express.Router();
  actuator.get('/health', (req: Request, res: Response): void => {
    res.json({ status: 'UP' });
  });
  app.use('/actuator', actuator);
};
