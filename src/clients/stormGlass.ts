import { Axios, AxiosStatic } from "axios";

export interface StormGlassPointSource {
    // noaa: number; -> Outra possibilidade
    [key: string]: number;
}

export interface StormGlassPoint {
    readonly time: string;
    readonly waveHeight: StormGlassPointSource;
    readonly waveDirection: StormGlassPointSource;
    readonly swellDirection: StormGlassPointSource;
    readonly swellHeight: StormGlassPointSource;
    readonly swellPeriod: StormGlassPointSource;
    readonly windDirection: StormGlassPointSource;
    readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse // Resposta esperada
{
    hours: StormGlassPoint[]; // Lista com vários objetos
}

export interface ForecastPoint {
    time: string;
    waveHeight: number;
    waveDirection: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    windDirection: number;
    windSpeed: number;
}

export class StormGlass {
    readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassAPISource = 'noaa';

    constructor(protected request: AxiosStatic) {

    }

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
        const response = await this.request.get<StormGlassForecastResponse>( // O get permite receber um tipo genérico como parâmetro
            `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`
        );

        return this.normalizeResponse(response.data);
    }

    private normalizeResponse(points: StormGlassForecastResponse): ForecastPoint[] {
        return points.hours
            .filter(this.isValidPoint.bind(this))
            .map((point) => ({
                time: point.time,
                swellDirection: point.swellDirection[this.stormGlassAPISource],
                swellHeight: point.swellHeight[this.stormGlassAPISource],
                swellPeriod: point.swellPeriod[this.stormGlassAPISource],
                waveDirection: point.waveDirection[this.stormGlassAPISource],
                waveHeight: point.waveHeight[this.stormGlassAPISource],
                windDirection: point.windDirection[this.stormGlassAPISource],
                windSpeed: point.windSpeed[this.stormGlassAPISource]
            }));
    }

    private isValidPoint(point: Partial<StormGlassPoint>): boolean // Make all properties in T optional
    {
        return !! (
            point.time && // Estudar
            point.swellDirection?.[this.stormGlassAPISource] &&
            point.swellHeight?.[this.stormGlassAPISource] &&
            point.swellPeriod?.[this.stormGlassAPISource] &&
            point.waveDirection?.[this.stormGlassAPISource] &&
            point.waveHeight?.[this.stormGlassAPISource] &&
            point.windDirection?.[this.stormGlassAPISource] &&
            point.windSpeed?.[this.stormGlassAPISource]
        );
    }
}