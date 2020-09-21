import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/providers/fakes/FakeStorageProvider';

import UpdateUserAvatarService from './UpdateUserAvatarService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to add an avatar to an "avatarless" user ', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('avatar.jpg');
  });

  it('should do nothing if the user does not exist', async () => {
    await expect(
      updateUserAvatarService.execute({
        user_id: 'invalid id',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete the old avatar when updating to a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar1.jpg',
    });

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    await expect(deleteFile).toHaveBeenCalledWith('avatar1.jpg');
    expect(updatedUser.avatar).toBe('avatar2.jpg');
  });
});
