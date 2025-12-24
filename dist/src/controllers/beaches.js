"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachesController = void 0;
const core_1 = require("@overnightjs/core");
const auth_1 = require("@src/middlewares/auth");
const beach_1 = require("@src/models/beach");
const _1 = require(".");
let BeachesController = class BeachesController extends _1.BaseController {
    async create(req, res) {
        var _a;
        try {
            const beach = new beach_1.Beach({ ...req.body, ...{ user: (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.id } });
            const result = await beach.save();
            res.status(201).send(result);
        }
        catch (error) {
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }
};
exports.BeachesController = BeachesController;
__decorate([
    (0, core_1.Post)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BeachesController.prototype, "create", null);
exports.BeachesController = BeachesController = __decorate([
    (0, core_1.Controller)('beaches'),
    (0, core_1.ClassMiddleware)(auth_1.authMiddleware)
], BeachesController);
//# sourceMappingURL=beaches.js.map