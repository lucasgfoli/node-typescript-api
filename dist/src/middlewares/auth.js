"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const auth_1 = __importDefault(require("@src/services/auth"));
function authMiddleware(req, res, next) {
    var _a, _b;
    const token = (_a = req.headers) === null || _a === void 0 ? void 0 : _a['x-access-token'];
    try {
        const decoded = auth_1.default.decodeToken(token);
        req.decoded = decoded;
        next();
    }
    catch (err) {
        let errorMessage = 'Falha na autenticação';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        else if (typeof err === 'string') {
            errorMessage = err;
        }
        (_b = res.status) === null || _b === void 0 ? void 0 : _b.call(res, 401).send({ code: 401, error: errorMessage });
    }
}
//# sourceMappingURL=auth.js.map