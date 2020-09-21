import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import ShowUserProfileService from './ShowUserProfileService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;

let showUserProfileService: ShowUserProfileService;

describe('ShowUserProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showUserProfileService = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to load the user profile information', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    const updatedUser = await showUserProfileService.execute({
      user_id: user.id,
    });

    expect(updatedUser.name).toBe('Test');
    expect(updatedUser.email).toBe('test@test.com');
  });

  it('should not be able to load the profile when the user does not exist', async () => {
    await expect(
      showUserProfileService.execute({
        user_id: 'invalid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
