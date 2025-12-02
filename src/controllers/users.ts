import { Controller, Post } from '@overnightjs/core';
import { Response, Request } from 'express';
import { User } from '@src/models/user';
import mongoose from 'mongoose';
import { BaseController } from '.';
import AuthService from '@src/services/auth';

@Controller('users')
export class UsersController extends BaseController {
    @Post('')
    public async create(req: Request, res: Response): Promise<void> {

        try {
            const user = new User(req.body);
            const newUser = await user.save();

            res.status(201).send(newUser);
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError || error instanceof Error) {
                this.sendCreateUpdateErrorResponse(res, error);
            } else {
                this.sendCreateUpdateErrorResponse(res, new Error('Unknown error'));
            }
        }
    }

    @Post('authenticate')
    public async authenticate(req: Request, res: Response): Promise<Response | undefined> {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({
                code: 401,
                error: 'User not found!',
            });
        }

        if (!(await AuthService.comparePasswords(password, user.password))) {
            return res.status(401).send({
                code: 401,
                error: 'Passoword does not match!',
            });
        }

        const token = AuthService.generateToken(user.toJSON());

        return res.status(200).send({ token: token });
    }
}