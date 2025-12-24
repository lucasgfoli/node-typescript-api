"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("@src/services/auth"));
const auth_2 = require("../auth");
describe('AuthMiddleware', () => {
    it('should verify a JWT token and call the next middleware', () => {
        const jwtToken = auth_1.default.generateToken({ data: 'fake' });
        const reqFake = {
            headers: {
                'x-access-token': jwtToken,
            },
        };
        const resFake = {};
        const nextFake = jest.fn();
        (0, auth_2.authMiddleware)(reqFake, resFake, nextFake);
        expect(nextFake).toHaveBeenCalled();
    });
    it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
        const reqFake = {
            headers: {
                'x-access-token': 'invalid-token',
            },
        };
        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        };
        const nextFake = jest.fn();
        (0, auth_2.authMiddleware)(reqFake, resFake, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: 'jwt malformed',
        });
    });
    it('should return ANAUTHORIZED middleware if theres no token', () => {
        const reqFake = {
            headers: {}
        };
        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        };
        const nextFake = jest.fn();
        (0, auth_2.authMiddleware)(reqFake, resFake, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: 'Token não informado',
        });
    });
});
//# sourceMappingURL=auth.test.js.map