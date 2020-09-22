import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProvidersMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRespository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointmentsInMonth = await this.appointmentsRespository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const countDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const daysInMonth = Array.from(
      { length: countDaysInMonth },
      (value, index) => index + 1,
    );

    const availability = daysInMonth.map(day => {
      const appointmentsInDay = appointmentsInMonth.filter(
        appointment => getDate(appointment.date) === day,
      );

      return { day, available: appointmentsInDay.length < 10 };
    });

    return availability;
  }
}

export default ListProvidersMonthAvailabilityService;
