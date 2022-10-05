import {
  ExpressUploadStream,
  ExpressStreamOptions,
} from '@main/middlewares/express-upload-stream';
import crypto from 'crypto';
import { Request, Response, Router } from 'express';
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
  router.post('/teste', [
    ExpressUploadStream(uploadOptions),
    async (req: Request, res: Response) => {
      return res.sendStatus(200);
    },
  ]);
};
