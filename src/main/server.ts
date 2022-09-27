import { Logger } from '@shared/logger';

import { app } from './app';
import { appConfig } from './config';

const { host } = appConfig.SERVER.http;
const { port } = appConfig.SERVER.http;

const logger = new Logger();

(async (): Promise<void> => {
  const expressApp = await app();
  expressApp.listen(port, host, () =>
    logger.info(
      `\x1b[32m Worker ${process.pid} running server ${host}:${port}\x1b[37m`,
    ),
  );
})();
