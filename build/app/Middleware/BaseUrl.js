"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/View"));
const get_how_long_ago_1 = require("get-how-long-ago");
class BaseUrl {
    async handle(ctx, next) {
        await ctx.auth.use('web').check();
        function appURL(path) {
            let baseURL = ctx.request.protocol() + '://' + ctx.request.host();
            if (path.startsWith('/')) {
                return baseURL + path;
            }
            else {
                return baseURL + '/' + path;
            }
        }
        ctx.appURL = appURL;
        View_1.default.global('appURL', appURL);
        View_1.default.global('timeAgo', get_how_long_ago_1.timeAgo);
        await next();
    }
}
exports.default = BaseUrl;
//# sourceMappingURL=BaseUrl.js.map