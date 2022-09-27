import { Either } from '@usecases/helpers/either';
import { left } from '@usecases/helpers/left';
import { right as teste } from '@usecases/helpers/right';

export interface UseCaseType<Request, Response> {
  execute(request: Request): Promise<Response>;
}

export abstract class UseCase<Request, Response>
  implements UseCaseType<Request, Response>
{
  abstract execute(request: Request): Promise<Response>;

  protected right<S>(data: S): Either<null, S> {
    return teste<S>(data);
  }

  protected left<F>(error: F): Either<F, null> {
    return left(error);
  }
}
