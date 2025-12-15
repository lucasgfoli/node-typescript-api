"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stormGlass_1 = require("@src/clients/stormGlass");
const stormglass_normalized_response_3_hours_json_1 = __importDefault(require("@test/fixtures/stormglass_normalized_response_3_hours.json"));
const forecast_1 = require("../forecast");
const beach_1 = require("@src/models/beach");
jest.mock('@src/clients/stormGlass');
describe('Forecast Service', () => {
    const mockedStormGlassService = new stormGlass_1.StormGlass();
    it('should return the forecast for a list', async () => {
        mockedStormGlassService.fetchPoints.mockResolvedValue(stormglass_normalized_response_3_hours_json_1.default);
        const beaches = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: beach_1.BeachPosition.E,
                user: 'fake-id',
            },
        ];
        const expectedResponse = [
            {
                time: '2020-04-26T00:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 64.26,
                        swellHeight: 0.15,
                        swellPeriod: 3.89,
                        time: '2020-04-26T00:00:00+00:00',
                        waveDirection: 231.38,
                        waveHeight: 0.47,
                        windDirection: 299.45,
                        windSpeed: 100,
                    },
                ],
            },
            {
                time: '2020-04-26T01:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 123.41,
                        swellHeight: 0.21,
                        swellPeriod: 3.67,
                        time: '2020-04-26T01:00:00+00:00',
                        waveDirection: 232.12,
                        waveHeight: 0.46,
                        windDirection: 310.48,
                        windSpeed: 100,
                    },
                ],
            },
            {
                time: '2020-04-26T02:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 182.56,
                        swellHeight: 0.28,
                        swellPeriod: 3.44,
                        time: '2020-04-26T02:00:00+00:00',
                        waveDirection: 232.86,
                        waveHeight: 0.46,
                        windDirection: 321.5,
                        windSpeed: 100,
                    },
                ],
            },
        ];
        const forecast = new forecast_1.Forecast(mockedStormGlassService);
        const beachesWihRaiting = await forecast.processForecastForBeaches(beaches);
        expect(beachesWihRaiting).toEqual(expectedResponse);
    });
    it('should return as empty list when the beaches array is empty', async () => {
        const forecast = new forecast_1.Forecast();
        const response = await forecast.processForecastForBeaches([]);
        expect(response).toEqual([]);
    });
    it('should throw internal processing error when something goes worng during the rating process', async () => {
        const beaches = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: beach_1.BeachPosition.E,
                user: 'some-id',
            },
        ];
        mockedStormGlassService.fetchPoints.mockRejectedValue('Error fetching data');
        const forecast = new forecast_1.Forecast(mockedStormGlassService);
        await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(forecast_1.ForecastProcessingInternalError);
    });
});
//# sourceMappingURL=forecast.test.js.map