import {
  ContainerVersion,
  injectionFactory,
} from '@external/dependency-injection/factory';
import { GoogleStorageService } from '@external/storage/google-storage-service';
import { appConfig } from '@main/config';
import {
  FileProps,
  ReturnStream,
} from '@main/middlewares/express-upload-stream';
import crypto from 'crypto';

import { Logger } from '@shared/logger';

export const streamFileAdapter = async (
  file: FileProps,
): Promise<ReturnStream> => {
  const logger = new Logger();
  try {
    const storageService = injectionFactory<GoogleStorageService>(
      'GoogleStorageService',
      ContainerVersion.DEFAULT,
    );

    const bucket = storageService
      .getGoogleStorage()
      .bucket(appConfig.STORAGE.google.videoBucket);

    const filename = `videos/${crypto.randomBytes(12).toString('hex')}-${
      file.originalname
    }`;
    const blob = bucket.file(filename);
    const stream = blob.createWriteStream({
      resumable: true,
      contentType: file.mimeType,
    });

    return {
      stream,
      filename,
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
