import { Controller } from '@adapters/controllers';
import {
  HttpRequest,
  QueryParamsBase,
} from '@adapters/controllers/port/http-request';
import { NextFunction, Request, Response } from 'express';

export const adapterRouteJson =
  (controller: Controller) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request: HttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query as QueryParamsBase,
        headers: req.headers,
        ip: req.ip,
        file: req.file,
        files: req.files,
      };

      const httpResponse = await controller.handle(request);

      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }

      res.status(httpResponse.statusCode).json(httpResponse.body);

      return next();
    } catch (error) {
      return next(error);
    }
  };
