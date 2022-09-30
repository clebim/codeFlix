import { Controller } from '@adapters/controllers';
import {
  ContainerVersion,
  injectionFactory,
} from '@external/dependency-injection/factory';
import { adapterRouteJson } from '@external/http/express-route-adapter';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/private/v1/category', [
    adapterRouteJson(
      injectionFactory<Controller>(
        'CreateCategoryController',
        ContainerVersion.V1,
      ),
    ),
  ]);

  router.get('/private/v1/category', [
    adapterRouteJson(
      injectionFactory<Controller>(
        'ListCategoryController',
        ContainerVersion.V1,
      ),
    ),
  ]);
};
