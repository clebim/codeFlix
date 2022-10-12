import { Controller } from '@adapters/controllers';
import { streamFileAdapter } from '@adapters/stream/stream-file';
import {
  ContainerVersion,
  injectionFactory,
} from '@external/dependency-injection/factory';
import { adapterRouteJson } from '@external/http/express-route-adapter';
import {
  ExpressUploadStream,
  ExpressStreamOptions,
} from '@main/middlewares/express/express-upload-stream';
import crypto from 'crypto';
import { Router } from 'express';
import { resolve } from 'path';

const uploadOptions: ExpressStreamOptions = {
  saveInMemory: false,
  diskStorage: {
    destination: resolve(__dirname, '..', '..', '..', '..', 'tmp', 'videos'),
    filename: (file, callback) => {
      const hash = crypto.randomBytes(12).toString('hex');
      const fileName = `${hash}-${file.originalname}`;

      return callback(fileName);
    },
  },
};

export default (router: Router): void => {
  router.post('/private/v1/video', [
    ExpressUploadStream(uploadOptions),
    adapterRouteJson(
      injectionFactory<Controller>(
        'CreateVideoController',
        ContainerVersion.V1,
      ),
    ),
    // deleteFileIfNecessary,
  ]);
};
