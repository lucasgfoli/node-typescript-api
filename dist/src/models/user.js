"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.CUSTOM_VALIDATION = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("@src/services/auth"));
const logger_1 = __importDefault(require("@src/logger"));
var CUSTOM_VALIDATION;
(function (CUSTOM_VALIDATION) {
    CUSTOM_VALIDATION["DUPLICATED"] = "DUPLICATED";
})(CUSTOM_VALIDATION || (exports.CUSTOM_VALIDATION = CUSTOM_VALIDATION = {}));
const schema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
}, {
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
schema.path('email').validate(async (email) => {
    const emailCount = await mongoose_1.default.models.User.countDocuments({ email });
    return !emailCount;
}, 'already exists in the database.', CUSTOM_VALIDATION.DUPLICATED);
schema.pre('save', async function () {
    if (!this.password || !this.isModified('password')) {
        return;
    }
    try {
        const hashedPassword = await auth_1.default.hashPassword(this.password);
        this.password = hashedPassword;
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error(error, `Error hashing the password for the user ${this.name}`);
        }
        else {
            logger_1.default.error(error);
        }
    }
});
exports.User = mongoose_1.default.model('User', schema);
//# sourceMappingURL=user.js.map