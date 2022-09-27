import { Controller } from '@adapters/controllers';
import {
  ContainerVersion,
  controllerFactory,
} from '@external/dependency-injection/factory';
import { adapterRouteJson } from '@external/http/express-route-adapter';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/private/v1/category', [
    adapterRouteJson(
      controllerFactory<Controller>(
        'CreateCategoryController',
        ContainerVersion.V1,
      ),
    ),
  ]);
};
