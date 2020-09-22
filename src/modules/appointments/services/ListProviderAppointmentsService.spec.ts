import 'reflect-metadata';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list all appointments, in a day, for a provider', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 3, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 3, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 4, 12, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider_id',
      day: 3,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
