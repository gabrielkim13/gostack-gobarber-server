import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/models/IHashProvider';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}

type IResponse = Omit<User, 'password'>;

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    oldPassword,
    newPassword,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const findEmailTaken = await this.usersRepository.findByEmail(email);

    if (findEmailTaken && email !== user.email) {
      throw new AppError('E-mail is already in use.');
    }

    if (!oldPassword) {
      throw new AppError('The current password must be informed.');
    }

    const checkCurrentPassword = await this.hashProvider.compareHash(
      oldPassword,
      user.password,
    );

    if (!checkCurrentPassword) {
      throw new AppError('The current password is invalid.');
    }

    user.name = name;
    user.email = email;
    user.password = await this.hashProvider.generateHash(newPassword);

    await this.usersRepository.save(user);

    const { password: _, ...userInfo } = user;

    return userInfo;
  }
}

export default UpdateUserProfileService;
