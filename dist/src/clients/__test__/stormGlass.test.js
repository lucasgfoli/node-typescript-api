"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stormGlass_1 = require("@src/clients/stormGlass");
const axios_1 = __importDefault(require("axios"));
const stormglass_weather_3_hours_json_1 = __importDefault(require("@test/fixtures/stormglass_weather_3_hours.json"));
const stormglass_normalized_response_3_hours_json_1 = __importDefault(require("@test/fixtures/stormglass_normalized_response_3_hours.json"));
jest.mock('axios');
describe('StormGlass client', () => {
    const mockedAxios = axios_1.default;
    it('should return the normalized forecast from the StormGlass service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
        mockedAxios.get.mockResolvedValue({ data: stormglass_weather_3_hours_json_1.default });
        const stormClass = new stormGlass_1.StormGlass(mockedAxios);
        const response = await stormClass.fetchPoints(lat, lng);
        expect(response).toEqual(stormglass_normalized_response_3_hours_json_1.default);
    });
    it('should exclude incomplete data points', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
        const incompleteResponse = {
            hours: [
                {
                    windDirection: {
                        noaa: 300,
                    },
                    time: '2020-04-26T00:00:00+00:00',
                },
            ],
        };
        mockedAxios.get.mockResolvedValue({ data: incompleteResponse });
        const stormGlass = new stormGlass_1.StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual([]);
    });
    it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
        mockedAxios.get.mockRejectedValue({ message: 'Network Error' });
        const stormGlass = new stormGlass_1.StormGlass(mockedAxios);
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow('Unexpected error when trying to communicate to StormGlass: Network Error');
    });
    it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
        class FakeAxiosError extends Error {
            constructor(response) {
                super();
                this.response = response;
            }
        }
        mockedAxios.get.mockRejectedValue(new FakeAxiosError({
            status: 429,
            data: { errors: ['Rate Limit reached'] },
        }));
        const stormGlass = new stormGlass_1.StormGlass(mockedAxios);
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow('Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429');
    });
});
//# sourceMappingURL=stormGlass.test.js.map