import AuthService from '@src/services/auth';
import { authMiddleware } from '../auth';
import { Request, Response } from 'express';

describe('AuthMiddleware', () => {
    it('should verify a JWT token and call the next middleware', () => {
        const jwtToken = AuthService.generateToken({ data: 'fake' });
        const reqFake = {
            headers: {
                'x-access-token': jwtToken,
            },
        } as unknown as Request;

        const resFake = {} as unknown as Response;

        const nextFake = jest.fn();

        authMiddleware(reqFake, resFake, nextFake);
        expect(nextFake).toHaveBeenCalled();
    });

    it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
        const reqFake = {
            headers: {
                'x-access-token': 'invalid-token',
            },
        } as unknown as Request;

        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        } as unknown as Response;

        const nextFake = jest.fn();
        authMiddleware(reqFake, resFake, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: 'jwt malformed',
        });
    });

    it('should return ANAUTHORIZED middleware if theres no token', () => {
        const reqFake = {
            headers: {}
        } as unknown as Request;

        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        } as unknown as Response;

        const nextFake = jest.fn();

        authMiddleware(reqFake, resFake, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: 'Token não informado',
        });
    });
});