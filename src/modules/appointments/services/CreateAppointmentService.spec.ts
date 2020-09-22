import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

let createAppointmentService: CreateAppointmentService;

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 3, 8),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');
  });

  it('should not be able to create 2 appointments on the same date', async () => {
    const appointmentDate = new Date(2020, 4, 3, 8);

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
});
