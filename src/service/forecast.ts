import { ForecastPoint, StormGlass } from "@src/clients/stormGlass";

export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N'
}

export interface Beach {
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
    user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) { }

    public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]>
    {
        const pointsWithCorrectSources:BeachForecast[] = [];

        for (const beache of beaches) {
            const point = await this.stormGlass.fetchPoints(beache.lat, beache.lng);
            const enrichedBeachData = point.map((e) => ({
                ... {
                    lat: beache.lat,
                    lng: beache.lng,
                    name: beache.name,
                    position: beache.position,
                    rating: 1
                },
                ...e,
            }));

            pointsWithCorrectSources.push( ... enrichedBeachData); //Estudar
        }

        return pointsWithCorrectSources;
    }
}