import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

@Controller('beaches')
@ClassMiddleware(authMiddleware) // Estudar isso aqui e outras coisas a respeito, creio que seja nest.
export class BeachesController {
    @Post('')
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const beach = new Beach({ ...req.body, ...{user: req.decoded?.id }}); // Estudar isso aqui
            const result = await beach.save();
            res.status(201).send(result); // Chama automaticamente o toJSON
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(422).send({ error: error.message });
                console.error(error);
            } else {
                console.error(error);
                res.status(500).send({error: 'Internal Server Error'});
            }
        }
    }
}