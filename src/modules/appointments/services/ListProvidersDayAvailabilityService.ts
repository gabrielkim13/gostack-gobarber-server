import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
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
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointmentsInDay = await this.appointmentsRespository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const firstHour = 8;
    const lastHour = 17;
    const hoursInDay = Array.from(
      { length: lastHour - firstHour + 1 },
      (value, index) => firstHour + index,
    );

    const availability = hoursInDay.map(hour => {
      const appointmentInHour = appointmentsInDay.find(
        appointment => getHours(appointment.date) === hour,
      );

      const currentDate = new Date(Date.now());
      const selectedDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !appointmentInHour && isAfter(selectedDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProvidersMonthAvailabilityService;
