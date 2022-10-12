import {
  ContainerVersion,
  injectionFactory,
} from '@external/dependency-injection/factory';
import { StorageService } from '@usecases/port/storage-service';
import { NextFunction, Request, Response } from 'express';

import { Logger } from '@shared/logger';

export const deleteFileIfNecessary = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const logger = new Logger();
    const stotageService = injectionFactory<StorageService>(
      'GoogleStorageService',
      ContainerVersion.DEFAULT,
    );

    logger.info('chamou', response.statusCode);

    if (response.statusCode === 201) {
      return next();
    }

    logger.info(`Create video failed with status code ${response.statusCode}`);

    let files: File[] = [];

    if (request.file) {
      files.push(request.file);
    } else {
      files = files.concat(request.files);
    }

    await Promise.all(
      files.map(file => {
        logger.info(`Delete file in storage. Filename: ${file.filename}`);
        return stotageService.deleteFile({
          filename: file.filename,
          bucket: 'codeflix_video_bucket',
        });
      }),
    );

    return next();
  } catch (error) {
    return next(error);
  }
};
