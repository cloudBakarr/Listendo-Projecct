"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasesController_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Controllers/Http/BasesController"));
class CheckEmailVerification extends BasesController_1.default {
    async handle(ctx, next) {
        if (ctx.auth &&
            ctx.auth.user &&
            ctx.auth.user.email_verifid) {
            await next();
        }
        else {
            ctx.response.redirect().toRoute('LoginController.notVerified');
        }
    }
}
exports.default = CheckEmailVerification;
//# sourceMappingURL=CheckEmailVerification.js.map