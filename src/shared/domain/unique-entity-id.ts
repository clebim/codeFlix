import { v4 as uuidV4 } from 'uuid';

export const generateUniqueId = (): string => {
  return uuidV4();
};
