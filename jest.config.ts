import type { Config } from '@jest/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  bail: true,
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts?(x)', '**/*.spec.ts?(x)'],
  cacheDirectory: '<rootDir>/target/jest-cache',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  coveragePathIgnorePatterns: ['node_modules', '.mock.ts'],
  coverageDirectory: '<rootDir>/target/test-results/',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './target/test-results/',
        outputName: 'TESTS-results-jest.xml',
      },
    ],
  ],
  transformIgnorePatterns: ['node_modules/'],
  preset: 'ts-jest',
} as Config.InitialOptions;
