import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/providers/fakes/FakeCacheProvider';

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

let createAppointmentService: CreateAppointmentService;

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 3, 12).getTime();
    });
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 3, 16),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');
  });

  it('should not be able to create 2 appointments on the same date', async () => {
    const appointmentDate = new Date(2020, 4, 3, 16);

    await createAppointmentService.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: appointmentDate,
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    await expect(
      createAppointmentService.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 4, 3, 8),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with the same user and provider', async () => {
    await expect(
      createAppointmentService.execute({
        provider_id: 'provider_id',
        user_id: 'provider_id',
        date: new Date(2020, 4, 3, 16),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8h', async () => {
    await expect(
      createAppointmentService.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 4, 4, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment after 17h', async () => {
    await expect(
      createAppointmentService.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 4, 4, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
