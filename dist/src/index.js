"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const server_1 = require("./server");
const config_1 = __importDefault(require("config"));
var ExitStatus;
(function (ExitStatus) {
    ExitStatus[ExitStatus["Failure"] = 1] = "Failure";
    ExitStatus[ExitStatus["Success"] = 0] = "Success";
})(ExitStatus || (ExitStatus = {}));
(async () => {
    try {
        const server = new server_1.SetupServer(config_1.default.get('App.port'));
        await server.init();
        server.start();
        const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        exitSignals.map((sig) => process.on(sig, async () => {
            try {
                await server.close().catch;
                logger_1.default.info('App exited with success');
                process.exit(ExitStatus.Success);
            }
            catch (error) {
                logger_1.default.error(`App exited with error ${error}`);
                process.exit(ExitStatus.Failure);
            }
        }));
    }
    catch (error) {
        logger_1.default.error(`App exited with error: ${error}`);
        process.exit(ExitStatus.Failure);
    }
})();
//# sourceMappingURL=index.js.map