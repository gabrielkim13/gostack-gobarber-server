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
      provider_id: '123456',
      date: new Date(2020, 4, 3, 8),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });

  it('should not be able to create 2 appointments on the same date', async () => {
    const appointmentDate = new Date(2020, 4, 3, 8);

    await createAppointmentService.execute({
      provider_id: '123456',
      date: appointmentDate,
    });

    await expect(
      createAppointmentService.execute({
        provider_id: '123456',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
