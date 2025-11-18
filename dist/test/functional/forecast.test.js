"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stormglass_weather_3_hours_json_1 = __importDefault(require("@test/fixtures/stormglass_weather_3_hours.json"));
const api_forecast_response_1_beach_json_1 = __importDefault(require("@test/fixtures/api_forecast_response_1_beach.json"));
const beach_1 = require("@src/models/beach");
const node_test_1 = require("node:test");
const nock_1 = __importDefault(require("nock"));
describe('Beach forecast functional tests', () => {
    (0, node_test_1.beforeEach)(async () => {
        await beach_1.Beach.deleteMany();
        const defaultBeach = {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: beach_1.BeachPosition.E
        };
        const beach = new beach_1.Beach(defaultBeach);
        await beach.save();
    });
    it('should return a forecast with just a few times', async () => {
        (0, nock_1.default)('https://api.stormglass.io:443', {
            encodedQueryParams: true,
            reqheaders: {
                Authorization: () => true,
            },
        })
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get('/v2/weather/point')
            .query({
            lat: "-33.792726",
            lng: "151.289824",
            params: /(.*)/,
            source: 'noaa',
        })
            .reply(200, stormglass_weather_3_hours_json_1.default);
        const { body, status } = await global.testRequest.get('/forecast');
        expect(status).toBe(200);
        expect(body).toEqual(api_forecast_response_1_beach_json_1.default);
    });
    it('should return 500 if something goes wrong during processing ', async () => {
        (0, nock_1.default)('https://api.stormglass.io:443', {
            encodedQueryParams: true,
            reqheaders: {
                Authorization: () => true,
            },
        })
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get('/v2/weather/point')
            .query({ lat: "-33.792726", lng: "151.289824", })
            .replyWithError('Something went wrong');
        const { status } = await global.testRequest.get('/forecast');
        expect(status).toBe(500);
    });
});
//# sourceMappingURL=forecast.test.js.map