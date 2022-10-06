import '@main/config';

import { databaseProvider } from './database-provider';

export const setupProviders = async (): Promise<void> => {
  await databaseProvider();
};
