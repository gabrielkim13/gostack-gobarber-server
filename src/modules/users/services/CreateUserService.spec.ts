import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import CreateUserService from './CreateUserService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUserService: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create user with an already used e-mail', async () => {
    await createUserService.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'Test2',
        email: 'test@test.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
