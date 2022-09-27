import { CreateCategoryController } from '@adapters/controllers/category/create-category-controller';
import { CreateCategoryValidator } from '@external/validators/validation-services/create-category-validator';
import { CreateCategoryUseCase } from '@usecases/category/create-category-use-case';

import { containerV1 } from '../index';

// USE CASES
containerV1.registerSingleton('CreateCategoryUseCase', CreateCategoryUseCase);

// CONTROLLERS
containerV1.registerSingleton(
  'CreateCategoryController',
  CreateCategoryController,
);

// VALIDATORS

containerV1.registerSingleton(
  'CreateCategoryValidator',
  CreateCategoryValidator,
);
