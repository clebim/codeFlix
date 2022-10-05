import busboy from 'busboy';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { writeFile } from 'fs';
import path from 'path';
import { promisify } from 'util';

export type FileProps = {
  originalname: string;
  encoding: string;
  fieldname: string;
  mimeType: string;
  size: number;
};

type cb = (filename: string) => () => Promise<void>;

export type ExpressStreamOptions = {
  saveInMemory: boolean;
  diskStorage?: {
    destination: string;
    filename(file: FileProps, callback: cb): () => Promise<void>;
  };
  streamFunction?(buffer: Buffer): Promise<void>;
};

export type File = {
  filename: string;
  filePath?: string;
  fieldname: string;
  encoding: string;
  size: number;
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
          const { filename, encoding, mimeType } = info;
          const chunks = [];

          file.on('data', async data => {
            const buffer = data instanceof Buffer ? data : Buffer.from(data);
            chunks.push(buffer);
            console.log(chunks.length);
            if (typeof streamFunction === 'function') {
              await streamFunction(buffer);
            }
          });

          file.on('end', () => {
            files.push({
              fieldname: name,
              filename,
              encoding,
              mimeType,
              size: Buffer.byteLength(Buffer.concat(chunks)),
              filePath: pathToSave ? `${pathToSave}${filename}` : undefined,
              buffer:
                saveInMemory || !!pathToSave
                  ? Buffer.concat(chunks)
                  : undefined,
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

      if (options.diskStorage) {
        const writeFileSync = promisify(writeFile);
        files.forEach(async file => {
          if (filename) {
            const callback = filename(
              {
                encoding: file.encoding,
                originalname: file.filename,
                fieldname: file.fieldname,
                mimeType: file.mimeType,
                size: file.size,
              },
              (filename: string) => () => {
                return writeFileSync(
                  path.join(pathToSave, filename),
                  file.buffer,
                );
              },
            );

            await callback();
          } else {
            await writeFileSync(
              path.join(
                pathToSave,
                `${crypto.randomBytes(12).toString('hex')}-${file.filename}`,
              ),
              file.buffer,
            );
          }
        });
      }

      request.body = body;
      request.file = files.length === 1 ? files[0] : undefined;
      request.files = files.length > 1 ? files : undefined;
      next();
    } catch (error) {
      next(error);
    }
  };
