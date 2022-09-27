import { container } from 'tsyringe';

import { Logger, LoggerMethods } from '@shared/logger';

const containerV1 = container.createChildContainer();

container.registerSingleton<LoggerMethods>('Logger', Logger);

export { container, containerV1 };
