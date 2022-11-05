import { User } from '@entities/user/index';
import { UserPlainProperties } from '@entities/user/interfaces/user-plain-properties';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UserAlreadyExistsError } from '@usecases/errors/user/user-already-exists-error';
import { Either } from '@usecases/helpers/either';
import { RequestValidator } from '@usecases/port/request-validator';
import { UseCase } from '@usecases/port/use-case';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { promisify } from 'util';

import { LoggerMethods } from '@shared/logger';

import { UserRepository } from './port/user-repository';

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type CreateUserResponse = Either<
  InvalidDataError | UserAlreadyExistsError,
  UserPlainProperties
>;

@injectable()
export class CreateUserUseCase extends UseCase<
  CreateUserRequest,
  CreateUserResponse
> {
  private generateHash = promisify(hash);

  constructor(
    @inject('Logger')
    private logger: LoggerMethods,
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('CreateUserValidator')
    private validator: RequestValidator<CreateUserRequest>,
  ) {
    super();
  }

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const { isValid, invalidFields } = this.validator.validate(request);

      if (!isValid) {
        return this.left(new InvalidDataError(invalidFields));
      }

      const { email, name, password } = request;

      const existsUser = await this.userRepository.getUniqueBy({ email });

      if (existsUser) {
        return this.left(
          new UserAlreadyExistsError(
            'Email already registered on the platform',
          ),
        );
      }

      const passwordHash = await this.generateHash(password, 10);

      const newUser = new User({
        email,
        name,
        password: passwordHash,
      });

      await this.userRepository.save(newUser);

      const userDTO = newUser.toDTO();

      delete userDTO.password;

      return this.right(userDTO);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
