import { CreateCategoryController } from '@adapters/controllers/category/create-category-controller';
import { ListCategoryController } from '@adapters/controllers/category/list-category-controller';
import { UpdateCategoryController } from '@adapters/controllers/category/update-category-controller';
import { CreateCategoryValidator } from '@external/validators/validation-services/category/create-category-validator';
import { ListCategoryValidator } from '@external/validators/validation-services/category/list-category-validator';
import { UpdateCategoryValidator } from '@external/validators/validation-services/category/update-category-validator';
import { CreateCategoryUseCase } from '@usecases/category/create-category-use-case';
import { ListCategoryUseCase } from '@usecases/category/list-category-use-case';
import { UpdateCategoryUseCase } from '@usecases/category/update-category-use-case';

import { containerV1 } from '../index';

// USE CASES
containerV1.registerSingleton('CreateCategoryUseCase', CreateCategoryUseCase);
containerV1.registerSingleton('ListCategoryUseCase', ListCategoryUseCase);
containerV1.registerSingleton('UpdateCategoryUseCase', UpdateCategoryUseCase);

// CONTROLLERS
containerV1.registerSingleton(
  'CreateCategoryController',
  CreateCategoryController,
);
containerV1.registerSingleton('ListCategoryController', ListCategoryController);
containerV1.registerSingleton(
  'UpdateCategoryController',
  UpdateCategoryController,
);

// VALIDATORS
containerV1.registerSingleton(
  'CreateCategoryValidator',
  CreateCategoryValidator,
);
containerV1.registerSingleton('ListCategoryValidator', ListCategoryValidator);
containerV1.registerSingleton(
  'UpdateCategoryValidator',
  UpdateCategoryValidator,
);
