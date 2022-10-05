import { CategoryRepository } from '@external/orm/repositories/category-repository';
import { GoogleStorageService } from '@external/storage/google-storage-service';
import { container } from 'tsyringe';

import { Logger, LoggerMethods } from '@shared/logger';

const containerV1 = container.createChildContainer();

container.registerSingleton<LoggerMethods>('Logger', Logger);

container.registerSingleton('GoogleStorageService', GoogleStorageService);

// REPOSITORIES
container.registerSingleton('CategoryRepository', CategoryRepository);

export { container, containerV1 };
