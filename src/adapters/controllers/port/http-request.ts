import { IncomingHttpHeaders } from 'http';

export type QueryParamsBase<T = object> = {
  [key: string]: string;
} & T;

type ParamsBase<T = object> = {
  [key: string]: string;
} & T;

export type HttpRequest<
  Body = object,
  QueryParams = object,
  Params = object,
> = {
  params?: ParamsBase<Params>;
  query?: QueryParamsBase<QueryParams>;
  body?: Body;
  headers?: IncomingHttpHeaders;
  ip?: string;
};
