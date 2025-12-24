import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';
import { BaseController } from '.';
import { decodedUser } from '@src/services/auth';

interface AuthenticatedRequest extends Request {
  decoded: decodedUser;
}

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  public async getForecastForLoggedUser(req: AuthenticatedRequest, res: Response): Promise<void> {

    try {
      const beaches = await Beach.find({ user: (req as any).decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(beaches as Beach[]);
      res.status(200).send(forecastData);
    } catch (error) {
      this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' });
    }
  }
}

