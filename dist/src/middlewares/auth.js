"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const auth_1 = __importDefault(require("@src/services/auth"));
function authMiddleware(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).send({ code: 401, error: 'Token não informado' });
        return;
    }
    try {
        const decoded = auth_1.default.decodeToken(token);
        req.decoded = decoded;
        next();
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Falha na autenticação';
        res.status(401).send({ code: 401, error: message });
    }
}
//# sourceMappingURL=auth.js.map