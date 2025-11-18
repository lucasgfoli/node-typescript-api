"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const config_1 = __importDefault(require("config"));
(async () => {
    const server = new server_1.SetupServer(config_1.default.get('App.port'));
    await server.init();
    server.start();
})();
//# sourceMappingURL=index.js.map