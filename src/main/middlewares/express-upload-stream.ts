import busboy from 'busboy';
import crypto from 'crypto';
import e, { NextFunction, Request, Response } from 'express';
import { createWriteStream, WriteStream } from 'fs';
import path from 'path';
import internal from 'stream';

import { Logger } from '@shared/logger';

export type FileProps = {
  originalname: string;
  encoding: string;
  fieldname: string;
  mimeType: string;
};

type cb = (filename: string) => () => WriteStream;

export type ReturnStream = {
  stream: internal.Writable | WriteStream;
  filename: string;
};

export type ExpressStreamOptions = {
  saveInMemory: boolean;
  diskStorage?: {
    destination: string;
    filename?(file: FileProps, callback: cb): () => WriteStream;
  };
  stream?(file: FileProps): Promise<ReturnStream>;
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
    const logger = new Logger();
    const body = {};
    const saveInMemory = options?.saveInMemory ?? true;
    const pathToSave = options?.diskStorage?.destination ?? undefined;
    const files: File[] = [];
    const streamParameter = options?.stream ?? undefined;
    const filename = options?.diskStorage?.filename ?? undefined;

    const bb = busboy({ headers: request.headers });
    try {
      await new Promise((resolve, reject) => {
        try {
          bb.on('field', (name, val) => {
            if (Object.keys(body).includes(name)) {
              if (Array.isArray(body[name])) {
                Object.assign(body, { [name]: body[name].concat(val) });
              } else {
                Object.assign(body, { [name]: [val, body[name]] });
              }
            } else {
              Object.assign(body, { [name]: val });
            }
          });

          bb.on('file', async (name, file, info) => {
            const { filename: originalName, encoding, mimeType } = info;
            let finalFilename = originalName;
            const chunks = [];
            const fileProps = {
              encoding,
              originalname: originalName,
              fieldname: name,
              mimeType,
            };

            if (typeof streamParameter === 'function') {
              try {
                const { stream: returnedStream, filename: externalFilename } =
                  await streamParameter(fileProps);
                finalFilename = externalFilename;
                file.pipe(returnedStream);
              } catch (error) {
                reject(error);
              }
            }

            if (options?.diskStorage) {
              try {
                let stream: WriteStream;
                if (typeof filename === 'function') {
                  const callback = filename(
                    fileProps,
                    (filename: string) => () => {
                      finalFilename = filename;
                      return createWriteStream(
                        path.join(pathToSave, finalFilename),
                      );
                    },
                  );

                  stream = callback();
                } else {
                  stream = createWriteStream(
                    path.join(
                      pathToSave,
                      `${crypto
                        .randomBytes(12)
                        .toString('hex')}-${originalName}`,
                    ),
                  );
                }

                file.pipe(stream);
              } catch (error) {
                reject(error);
              }
            }

            file.on('data', async data => {
              const buffer = data instanceof Buffer ? data : Buffer.from(data);
              if (saveInMemory) {
                chunks.push(buffer);
              }
            });

            file.on('end', () => {
              files.push({
                fieldname: name,
                filename: finalFilename,
                encoding,
                mimeType,
                size: saveInMemory
                  ? Buffer.byteLength(Buffer.concat(chunks))
                  : undefined,
                filePath: pathToSave
                  ? `${pathToSave}${finalFilename}`
                  : undefined,
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
        } catch (error) {
          reject(error);
        }
      });

      request.body = body;
      request.file = files.length === 1 ? files[0] : undefined;
      request.files = files.length > 1 ? files : undefined;
      next();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
