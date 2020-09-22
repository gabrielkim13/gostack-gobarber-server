import 'reflect-metadata';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeCacheProvider from '@shared/providers/fakes/FakeCacheProvider';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

let listProvidersService: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all providers', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User',
      email: 'user@test.com',
      password: '123456',
    });

    const provider1 = await fakeUsersRepository.create({
      name: 'Provider 1',
      email: 'provider1@test.com',
      password: '123456',
    });

    const provider2 = await fakeUsersRepository.create({
      name: 'Provider 2',
      email: 'provider2@test.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: user.id,
    });

    expect(providers).toEqual([provider1, provider2]);
  });
});
