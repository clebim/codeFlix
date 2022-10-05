import busboy from 'busboy';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { createWriteStream, WriteStream } from 'fs';
import path from 'path';

export type FileProps = {
  originalname: string;
  encoding: string;
  fieldname: string;
  mimeType: string;
};

type cb = (filename: string) => () => WriteStream;

export type ExpressStreamOptions = {
  saveInMemory: boolean;
  diskStorage?: {
    destination: string;
    filename?(file: FileProps, callback: cb): () => WriteStream;
  };
  streamFunction?(buffer: Buffer): Promise<void>;
};

export type File = {
  filename: string;
  filePath?: string;
  fieldname: string;
  encoding: string;
  size?: number;
  mimeType: string;
  buffer?: Buffer;
};

export const ExpressUploadStream =
  (options?: ExpressStreamOptions) =>
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = {};
      const saveInMemory = options?.saveInMemory ?? true;
      const pathToSave = options?.diskStorage?.destination ?? undefined;
      const files: File[] = [];
      const streamFunction = options?.streamFunction ?? undefined;
      const filename = options?.diskStorage?.filename ?? undefined;

      const bb = busboy({ headers: request.headers });

      await new Promise((resolve, reject) => {
        bb.on('field', (name, val) => {
          Object.assign(body, { [name]: val });
        });

        bb.on('file', (name, file, info) => {
          const { filename: originalName, encoding, mimeType } = info;
          const chunks = [];

          if (options?.diskStorage) {
            let stream: WriteStream;
            if (typeof filename === 'function') {
              const callback = filename(
                {
                  encoding,
                  originalname: originalName,
                  fieldname: name,
                  mimeType,
                },
                (filename: string) => () => {
                  return createWriteStream(path.join(pathToSave, filename));
                },
              );

              stream = callback();
            } else {
              stream = createWriteStream(
                path.join(
                  pathToSave,
                  `${crypto.randomBytes(12).toString('hex')}-${originalName}`,
                ),
              );
            }

            file.pipe(stream);
          }

          file.on('data', async data => {
            const buffer = data instanceof Buffer ? data : Buffer.from(data);
            if (saveInMemory) {
              chunks.push(buffer);
            }
            if (typeof streamFunction === 'function') {
              await streamFunction(buffer);
            }
          });

          file.on('end', () => {
            files.push({
              fieldname: name,
              filename: originalName,
              encoding,
              mimeType,
              size: saveInMemory
                ? Buffer.byteLength(Buffer.concat(chunks))
                : undefined,
              filePath: pathToSave ? `${pathToSave}${filename}` : undefined,
              buffer: saveInMemory ? Buffer.concat(chunks) : undefined,
            });
          });

          bb.on('error', error => {
            return reject(error);
          });

          bb.on('close', () => {
            return resolve(true);
          });
        });
        request.pipe(bb);
      });

      request.body = body;
      request.file = files.length === 1 ? files[0] : undefined;
      request.files = files.length > 1 ? files : undefined;
      next();
    } catch (error) {
      next(error);
    }
  };
