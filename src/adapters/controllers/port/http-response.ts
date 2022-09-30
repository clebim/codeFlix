import { IncomingHttpHeaders } from 'http';

export type HttpResponse<T = any> = {
  statusCode: number;
  body?: T;
  charset?: string;
  headers?: IncomingHttpHeaders;
};
