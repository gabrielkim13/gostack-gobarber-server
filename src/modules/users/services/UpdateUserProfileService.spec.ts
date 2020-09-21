import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/fakes/FakeHashProvider';

import UpdateUserProfileService from './UpdateUserProfileService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateUserProfileService: UpdateUserProfileService;

describe('UpdateUserProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserProfileService = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the user profile information', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: 'Updated',
      email: 'updated@test.com',
      oldPassword: '123456',
      newPassword: '123456',
    });

    expect(updatedUser.name).toBe('Updated');
    expect(updatedUser.email).toBe('updated@test.com');
  });

  it('should not be able to update the profile if the user does not exist', async () => {
    await expect(
      updateUserProfileService.execute({
        user_id: '',
        name: 'Updated',
        email: 'updated@test.com',
        oldPassword: '123456',
        newPassword: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the e-mail if it is already taken', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test 1',
      email: 'test1@test.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'Test 2',
      email: 'test2@test.com',
      password: '123456',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'Updated',
        email: 'test2@test.com',
        oldPassword: '123456',
        newPassword: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to keep the e-mail unchanged when updating the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test 1',
      email: 'test1@test.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: 'Updated',
      email: 'test1@test.com',
      oldPassword: '123456',
      newPassword: '123456',
    });

    expect(updatedUser.name).toBe('Updated');
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test 1',
      email: 'test1@test.com',
      password: '123456',
    });

    await updateUserProfileService.execute({
      user_id: user.id,
      name: 'Updated',
      email: 'test1@test.com',
      oldPassword: '123456',
      newPassword: '12345678',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('12345678');
  });

  it('should not be able to update the profile without the current password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test 1',
      email: 'test1@test.com',
      password: '123456',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'Updated',
        email: 'test1@test.com',
        oldPassword: '',
        newPassword: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile with an invalid current password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test 1',
      email: 'test1@test.com',
      password: '123456',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'Updated',
        email: 'test1@test.com',
        oldPassword: 'invalid',
        newPassword: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
