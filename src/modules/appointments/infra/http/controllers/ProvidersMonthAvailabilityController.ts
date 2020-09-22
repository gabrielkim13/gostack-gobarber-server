import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersMonthAvailabilityService from '@modules/appointments/services/ListProvidersMonthAvailabilityService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.body;

    const listProvidersMonthAvailabilityService = container.resolve(
      ListProvidersMonthAvailabilityService,
    );

    const availability = await listProvidersMonthAvailabilityService.execute({
      provider_id,
      month,
      year,
    });

    return response.json(availability);
  }
}
