import { InternalError } from "@src/util/errors/internal-error";
import { AxiosStatic } from "axios";
import config, { IConfig } from 'config';

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

export class ClientRequestError extends InternalError {
    constructor(message: string) {

        const internalMessage = 'Unexpected error when trying to communicate to StormGlass';
        super(`${internalMessage}: ${message}`);
    }
}

export class StormGlassResponseError extends InternalError {
    constructor(message: string) {
        const internalMessage =
            'Unexpected error returned by the StormGlass service';

        super(`${internalMessage}: ${message}`);
    }
}

const stormGlassResourceConfig: IConfig = config.get(
    'App.resources.StormGlass'
);

export class StormGlass {
    readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassAPISource = 'noaa';

    constructor(protected request: AxiosStatic) {

    }

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
        try {
            const response = await this.request.get<StormGlassForecastResponse>( // O get permite receber um tipo genérico como parâmetro
                `${stormGlassResourceConfig.get('apiUrl')}/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`,
                {
                    headers: {
                        Authorization: stormGlassResourceConfig.get('apiToken')
                    },
                }
            );

            return this.normalizeResponse(response.data);
        }
        catch (err: unknown) {

            if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as { response?: { status?: number } }).response?.status === 'number') {
                const responseError = err as { response: { data: unknown; status: number } };
                throw new StormGlassResponseError(`Error: ${JSON.stringify(responseError.response.data)} Code: ${responseError.response.status}`);
            }

            if (err instanceof Error) {
                throw new ClientRequestError(err.message);
            }

            // fallback genérico
            if (typeof err === 'object' && err !== null && 'message' in err) {
                throw new ClientRequestError(String((err as { message: string }).message));
            }

            throw new ClientRequestError(String(err));
        }

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
        return !!( // Change to boolean
            point.time &&
            point.swellDirection?.[this.stormGlassAPISource] && // Check if a required property and if there's data for the noaa
            point.swellHeight?.[this.stormGlassAPISource] && // ? Check if a propertie is null or undefined
            point.swellPeriod?.[this.stormGlassAPISource] &&
            point.waveDirection?.[this.stormGlassAPISource] &&
            point.waveHeight?.[this.stormGlassAPISource] &&
            point.windDirection?.[this.stormGlassAPISource] &&
            point.windSpeed?.[this.stormGlassAPISource]
        );
    }
}