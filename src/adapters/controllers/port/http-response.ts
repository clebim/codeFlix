import { IncomingHttpHeaders } from 'http';

export type HttpResponse<T = object> = {
  statusCode: number;
  body?: T;
  charset?: string;
  headers?: IncomingHttpHeaders;
};
