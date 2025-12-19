"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("@src/models/user");
const logger_1 = __importDefault(require("@src/logger"));
class BaseController {
    sendCreateUpdateErrorResponse(res, error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            const clientErrors = this.handleClientErrors(error);
            return res.status(clientErrors.code).send({ code: clientErrors.code, error: clientErrors.error });
        }
        else {
            logger_1.default.error(error);
            return res.status(500).send({ code: 500, error: 'Something Went Wrong' });
        }
    }
    handleClientErrors(error) {
        const duplicatedKindErrors = Object.values(error.errors).filter((err) => err.kind === user_1.CUSTOM_VALIDATION.DUPLICATED);
        if (duplicatedKindErrors.length) {
            return { code: 409, error: error.message };
        }
        else
            return { code: 422, error: error.message };
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=index.js.map