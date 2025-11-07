import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios'; // Alternativa paralela ao fetch, mas com tratamento de erros, interceptors, entre outros
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
    it('should return the normalized forecast from the StormGlass service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        axios.get = jest.fn().mockResolvedValue(stormGlassWeather3HoursFixture);

        const stormClass = new StormGlass(axios);
        const response = await stormClass.fetchPoints(lat, lng);
        expect(response).toEqual(stormGlassNormalized3HoursFixture)
    });
});