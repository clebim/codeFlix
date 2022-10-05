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
  router.post('/private/v1/video', [
    ExpressUploadStream(uploadOptions),
    async (req: Request, res: Response) => {
      console.log(req.files);
      return res.sendStatus(200);
    },
  ]);
};
