import { Storage, StorageOptions } from '@google-cloud/storage';
import { appConfig } from '@main/config';
import {
  CreateStreamOptions,
  DeleteFileProps,
  DownloadBufferProps,
  ExistsBufferProps,
  FileUploadProps,
  StorageService,
} from '@usecases/port/storage-service';
import internal from 'stream';
import { inject, injectable } from 'tsyringe';

import { LoggerMethods } from '@shared/logger';

@injectable()
export class GoogleStorageService implements StorageService {
  private storateOptions: StorageOptions;

  constructor(
    @inject('Logger')
    private logger: LoggerMethods,
  ) {
    this.storateOptions = {
      credentials: {
        client_email: appConfig.STORAGE.google.accountEmail,
        private_key: appConfig.STORAGE.google.privateKey,
      },
      projectId: appConfig.STORAGE.google.projectId,
    };
  }

  async deleteFile(deleteProps: DeleteFileProps): Promise<void> {
    try {
      const { filename, bucket } = deleteProps;

      await this.getGoogleStorage().bucket(bucket).file(filename).delete();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public getGoogleStorage(): Storage {
    return new Storage(this.storateOptions);
  }

  createStorageStream(options: CreateStreamOptions): internal.Writable {
    try {
      const { blobName, bucketName, type } = options;

      const bucket = this.getGoogleStorage().bucket(bucketName);
      const blob = bucket.file(blobName);

      return blob.createWriteStream({ resumable: true, contentType: type });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  uploadFile(file: FileUploadProps): Promise<string> {
    throw new Error('Method not implemented.');
  }
  existsBuffer(existsBufferProps: ExistsBufferProps): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  downloadBuffer(downloadBufferProps: DownloadBufferProps): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }
}
