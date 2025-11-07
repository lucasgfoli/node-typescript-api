import { Axios, AxiosStatic } from "axios";

export class StormGlass {
    readonly stormGlassAPIParams = 'swellDirection,sewllHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassAPISource = 'nooaaa';

    constructor(protected request: AxiosStatic) {

    }

    public async fetchPoints(lat: number, lng: number): Promise<{}> {
        return this.request.get(
            `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`
        );
    }
}