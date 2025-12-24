"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const beach_1 = require("@src/models/beach");
const user_1 = require("@src/models/user");
const auth_1 = __importDefault(require("@src/services/auth"));
describe('Beaches functional tests', () => {
    const defaultUser = {
        name: 'John Doe',
        email: 'john2@mail.com',
        password: '1234',
    };
    let token;
    beforeEach(async () => {
        await beach_1.Beach.deleteMany({});
        await user_1.User.deleteMany({});
        const user = await new user_1.User(defaultUser).save();
        token = auth_1.default.generateToken(user.toJSON());
    });
    describe('When creating a beach', () => {
        it('should create a beach with success', async () => {
            const newBeach = {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: 'E',
            };
            const response = await global.testRequest.post('/beaches').set({ 'x-access-token': token }).send(newBeach);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newBeach));
        });
        it('should return 422 when there is a validation error', async () => {
            const newBeach = {
                lat: 'invalid_string',
                lng: 151.289824,
                name: 'Manly',
                position: 'E',
            };
            const response = await global.testRequest.post('/beaches').set({ 'x-access-token': token }).send(newBeach);
            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                code: 422,
                error: 'Unprocessable Entity',
                message: 'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
            });
        });
        it.skip('should return 500 when there is any error other than validation error', async () => {
        });
    });
});
//# sourceMappingURL=beaches.test.js.map