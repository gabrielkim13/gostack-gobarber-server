import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/providers/fakes/FakeCacheProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import FakeHashProvider from '../providers/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate a user with valid credentials', async () => {
    const user = await createUserService.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'test@test.com',
      password: '123456',
    });

    expect(response.user).toEqual(user);
    expect(response).toHaveProperty('token');
  });

  it('should not authenticate a non-existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not authenticate a user with invalid credentials', async () => {
    await createUserService.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email: 'test@test.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
