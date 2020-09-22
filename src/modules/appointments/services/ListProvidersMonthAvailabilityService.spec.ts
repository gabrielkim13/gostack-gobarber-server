import 'reflect-metadata';

// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProvidersMonthAvailabilityService from '@modules/appointments/services/ListProvidersMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

let listProvidersMonthAvailabilityService: ListProvidersMonthAvailabilityService;

describe('ListProvidersMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProvidersMonthAvailabilityService = new ListProvidersMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list all available days, in a month, for a provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 8, 0, 0),
    });

    const availableHours = Array.from(
      { length: 10 },
      (value, index) => 8 + index,
    );

    await Promise.all(
      availableHours.map(async hour =>
        fakeAppointmentsRepository.create({
          provider_id: 'provider_id',
          user_id: 'user_id',
          date: new Date(2020, 4, 3, hour, 0, 0),
        }),
      ),
    );

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 4, 8, 0, 0),
    });

    const availability = await listProvidersMonthAvailabilityService.execute({
      provider_id: 'provider_id',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 2, available: true },
        { day: 3, available: false },
        { day: 4, available: true },
      ]),
    );
  });
});
