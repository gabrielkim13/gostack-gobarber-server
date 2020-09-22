import 'reflect-metadata';

// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProvidersDayAvailabilityService from '@modules/appointments/services/ListProvidersDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

let listProvidersDayAvailabilityService: ListProvidersDayAvailabilityService;

describe('ListProvidersDayAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProvidersDayAvailabilityService = new ListProvidersDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list all available hours, in a day, for a provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'id',
      date: new Date(2020, 4, 3, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'id',
      date: new Date(2020, 4, 3, 12, 0, 0),
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 3, 11, 30).getTime());

    const availability = await listProvidersDayAvailabilityService.execute({
      provider_id: 'id',
      day: 3,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: false },
        { hour: 13, available: true },
        { hour: 14, available: true },
      ]),
    );
  });
});
