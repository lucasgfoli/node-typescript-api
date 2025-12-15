"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
class AuthService {
    static async hashPassword(password, salt = 10) {
        return await bcrypt_1.default.hash(password, salt);
    }
    static async comparePasswords(password, hashedPassword) {
        return await bcrypt_1.default.compare(password, hashedPassword);
    }
    static generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.default.get('App.auth.key'), {
            expiresIn: config_1.default.get('App.auth.tokenExpiresIn'),
        });
    }
    static decodeToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.default.get('App.auth.key'));
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.js.map