"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forecast = exports.ForecastProcessingInternalError = void 0;
const stormGlass_1 = require("@src/clients/stormGlass");
const internal_error_1 = require("@src/util/errors/internal-error");
const logger_1 = __importDefault(require("@src/logger"));
class ForecastProcessingInternalError extends internal_error_1.InternalError {
    constructor(message) {
        super(`Unexepected error during the forecast processing: ${message}`);
    }
}
exports.ForecastProcessingInternalError = ForecastProcessingInternalError;
class Forecast {
    constructor(stormGlass = new stormGlass_1.StormGlass()) {
        this.stormGlass = stormGlass;
    }
    async processForecastForBeaches(beaches) {
        const pointsWithCorrectSources = [];
        logger_1.default.info(`Preparing forecast for ${beaches.length} beaches`);
        try {
            for (const beache of beaches) {
                const points = await this.stormGlass.fetchPoints(beache.lat, beache.lng);
                const enrichedBeachData = this.enrichedBeachData(points, beache);
                pointsWithCorrectSources.push(...enrichedBeachData);
            }
            return this.mapForecastByTime(pointsWithCorrectSources);
        }
        catch (error) {
            logger_1.default.error(error);
            throw new ForecastProcessingInternalError(error.message);
        }
    }
    enrichedBeachData(points, beach) {
        return points.map((p) => ({
            ...{
                lat: beach.lat,
                lng: beach.lng,
                name: beach.name,
                position: beach.position,
                rating: 1,
            },
            ...p,
        }));
    }
    mapForecastByTime(forecast) {
        const forecastByTime = [];
        for (const point of forecast) {
            const timePoint = forecastByTime.find((f) => f.time === point.time);
            if (timePoint) {
                timePoint.forecast.push(point);
            }
            else {
                forecastByTime.push({
                    time: point.time,
                    forecast: [point],
                });
            }
        }
        return forecastByTime;
    }
}
exports.Forecast = Forecast;
//# sourceMappingURL=forecast.js.map