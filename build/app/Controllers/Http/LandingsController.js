"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasesController_1 = __importDefault(require("./BasesController"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class LandingsController extends BasesController_1.default {
    async index({ request, view }) {
        const page = request.input('page', 1);
        const limit = 20;
        const media = await Database_1.default.from('media')
            .join('users', 'media.user_id', '=', 'users.id')
            .select('media.*')
            .select('users.first_name')
            .select('users.last_name')
            .select('users.image')
            .orderBy('created_at', 'desc')
            .paginate(page, limit);
        return this.view(view, 'home', {
            title: '',
            media
        });
    }
}
exports.default = LandingsController;
//# sourceMappingURL=LandingsController.js.map