import { v4 as uuid } from 'uuid';
import { isEqual, isSameMonth, isSameDay } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(
      appointment,
      { id: uuid() },
      {
        provider_id,
        user_id,
        date,
      },
    );

    this.appointments.push(appointment);

    return appointment;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const dateInMonth = new Date(year, month - 1, 1, 0, 0, 0);

    const appointments = this.appointments.filter(
      appointment =>
        isSameMonth(appointment.date, dateInMonth) &&
        appointment.provider_id === provider_id,
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const dateInDay = new Date(year, month - 1, day, 0, 0, 0);

    const appointments = this.appointments.filter(
      appointment =>
        isSameDay(appointment.date, dateInDay) &&
        appointment.provider_id === provider_id,
    );

    return appointments;
  }
}

export default AppointmentsRepository;
