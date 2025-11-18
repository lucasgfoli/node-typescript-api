"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beach = exports.BeachPosition = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var BeachPosition;
(function (BeachPosition) {
    BeachPosition["S"] = "S";
    BeachPosition["E"] = "E";
    BeachPosition["W"] = "W";
    BeachPosition["N"] = "N";
})(BeachPosition || (exports.BeachPosition = BeachPosition = {}));
const schema = new mongoose_1.default.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    user: { type: String, required: false },
    position: {
        type: String,
        enum: Object.values(BeachPosition),
        required: true
    },
}, {
    toJSON: {
        transform(_doc, ret) {
            const obj = ret;
            obj.id = obj._id;
            delete obj._id;
            delete obj.__v;
            return obj;
        },
    },
});
exports.Beach = mongoose_1.default.model('Beach', schema);
//# sourceMappingURL=beach.js.map