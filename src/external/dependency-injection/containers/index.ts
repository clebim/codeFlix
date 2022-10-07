import { CategoryRepository } from '@external/orm/repositories/category-repository';
import { VideoRepository } from '@external/orm/repositories/video-repository';
import { GoogleStorageService } from '@external/storage/google-storage-service';
import { container } from 'tsyringe';

import { Logger, LoggerMethods } from '@shared/logger';

const containerV1 = container.createChildContainer();

container.registerSingleton<LoggerMethods>('Logger', Logger);

container.registerSingleton('GoogleStorageService', GoogleStorageService);

// REPOSITORIES
container.registerSingleton('CategoryRepository', CategoryRepository);
container.registerSingleton('VideoRepository', VideoRepository);

export { container, containerV1 };
