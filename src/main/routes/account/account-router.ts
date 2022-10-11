import { Controller } from '@adapters/controllers';
import {
  ContainerVersion,
  injectionFactory,
} from '@external/dependency-injection/factory';
import { adapterRouteJson } from '@external/http/express-route-adapter';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/private/v1/account/user', [
    adapterRouteJson(
      injectionFactory<Controller>('CreateUserController', ContainerVersion.V1),
    ),
  ]);
};
