import { appConfig } from '@main/config';
import { format } from 'date-fns-tz';

export type LoggerMethods = {
  error(error: Error): void;
  info(...logs): void;
};

export class Logger implements LoggerMethods {
  private localTimeZone: string =
    appConfig.LOCALTIMEZONE ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  error(error: Error) {
    const fullError = {
      stack: error.stack ? error.stack.split('\n')[1].split(' at')[1] : 'error',
      messageError: error.message,
      errorName: error.name,
    };
    if (appConfig.TEST !== true) {
      console.error(
        `[\x1b[31mERROR] ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', {
          timeZone: 'America/Sao_Paulo',
        })}`,
        `Error in server \x1b[37m\n`,
        JSON.stringify(fullError, null, 2),
      );
    }
  }

  info(...logs) {
    logs.forEach(log =>
      console.info(
        `[\x1b[34mINFO\x1b[37m] ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', {
          timeZone: this.localTimeZone,
        })} - ${log}
    `,
      ),
    );
  }
}
