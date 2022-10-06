import { datasource } from '@external/orm';

import { Logger } from '@shared/logger';

const logger = new Logger();

export const databaseProvider = async () => {
  try {
    await datasource.initialize();
    logger.info('Database connected');
  } catch (error) {
    logger.info('Failed to connect to database');
    logger.error(error);
    throw error;
  }
};
