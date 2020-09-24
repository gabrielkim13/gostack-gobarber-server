import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const twoDigitMonth = String(month).padStart(2, '0');

    const findAppointment = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateColumnName =>
            `to_char(${dateColumnName}, 'MM-YYYY') = '${twoDigitMonth}-${year}'`,
        ),
      },
    });

    return findAppointment;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const twoDigitDay = String(day).padStart(2, '0');
    const twoDigitMonth = String(month).padStart(2, '0');

    const findAppointment = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateColumnName =>
            `to_char(${dateColumnName}, 'DD-MM-YYYY') = '${twoDigitDay}-${twoDigitMonth}-${year}'`,
        ),
      },
    });

    return findAppointment;
  }
}

export default AppointmentsRepository;
