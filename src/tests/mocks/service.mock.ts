import { mock, MockProxy } from 'jest-mock-extended';

import { LoggerMethods } from '@shared/logger';

export const loggerMock: MockProxy<LoggerMethods> & LoggerMethods =
  mock<LoggerMethods>();
