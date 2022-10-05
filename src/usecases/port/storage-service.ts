import internal from 'stream';

export type BucketNames = 'videoContainer';

export type DownloadBufferProps = {
  bucketName: BucketNames;
  blobName: string;
  type: string;
};

export type ExistsBufferProps = {
  bucketName: BucketNames;
  blobName: string;
  type: string;
};

export type CreateStreamOptions = {
  bucketName: BucketNames;
  blobName: string;
  type: string;
};

export type FileUploadProps = {
  file: {
    type: string;
    buffer: Buffer;
    size: number;
    fileName?: string;
  };
  bucketName: string;
};

export interface StorageService {
  createStorageStream(options: CreateStreamOptions): internal.Writable;
  uploadFile(file: FileUploadProps): Promise<string>;
  existsBuffer(existsBufferProps: ExistsBufferProps): Promise<boolean>;
  downloadBuffer(downloadBufferProps: DownloadBufferProps): Promise<Buffer>;
}
