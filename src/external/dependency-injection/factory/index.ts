import { DependencyContainer } from 'tsyringe';

import { container, containerV1 } from '../containers';

const containerMap: { [key: number]: DependencyContainer } = {
  0: container,
  1: containerV1,
};

export enum ContainerVersion {
  DEFAULT = 0,
  V1 = 1,
}

export const injectionFactory = <T>(
  injectionToken: string,
  version: number,
): T => containerMap[version].resolve<T>(injectionToken);
