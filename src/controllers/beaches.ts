import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('beaches')
@ClassMiddleware(authMiddleware) // Estudar isso aqui e outras coisas a respeito, creio que seja nest.
export class BeachesController extends BaseController {
    @Post('')
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const beach = new Beach({ ...req.body, ...{ user: (req as any).decoded?.id } }); // Estudar isso aqui
            const result = await beach.save();
            res.status(201).send(result); // Chama automaticamente o toJSON
        } catch (error) {
            this.sendCreateUpdateErrorResponse(res, error as Error);
        }
    }
}