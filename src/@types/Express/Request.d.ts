type File = {
  filename: string;
  filePath?: string;
  fieldname: string;
  encoding: string;
  mimeType: string;
  buffer?: Buffer;
};

declare namespace Express {
  export interface Request {
    file?: File;
    files?: File[];
  }
}
