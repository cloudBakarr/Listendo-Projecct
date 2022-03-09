"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasesController_1 = __importDefault(require("./BasesController"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const UserInfoValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserInfoValidator"));
const ChangePasswordValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/ChangePasswordValidator"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const gcs_1 = global[Symbol.for('ioc.use')]("App/CloudStorage/gcs");
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const AddMediaValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/AddMediaValidator"));
const Media_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Media"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const EditMediaValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/EditMediaValidator"));
class DashboardController extends BasesController_1.default {
    async index({ view, auth, request, session, response }) {
        try {
            let user = auth.user;
            if (user instanceof User_1.default) {
                const page = request.input('page', 1);
                const limit = 10;
                const media = await Database_1.default.from('media')
                    .where('user_id', user.id)
                    .orderBy('created_at', 'desc')
                    .paginate(page, limit);
                return this.view(view, 'dashboard', {
                    title: 'Dashboard',
                    media,
                });
            }
            else {
                throw new Error('User not found!');
            }
        }
        catch (e) {
            this.handelError(session, response, e);
        }
    }
    showSettings({ view, auth }) {
        return this.view(view, 'settings', {
            title: 'Profile Settings',
            user: auth.user,
        });
    }
    async changePassword({ request, session, response, auth }) {
        try {
            let user = auth.user;
            if (user instanceof User_1.default) {
                const payload = await request.validate(ChangePasswordValidator_1.default);
                if (await Hash_1.default.verify(user.password, payload.oldPassword)) {
                    user.password = await Hash_1.default.make(payload.newPassword);
                    await user.save();
                    session.flash('messages', [
                        {
                            text: 'User password changed successfuly',
                            type: 'success',
                        },
                    ]);
                    response.redirect().back();
                }
                else {
                    throw new Error('Invalid password!');
                }
            }
            else {
                throw new Error('User not found!');
            }
        }
        catch (e) {
            this.handelError(session, response, e);
        }
    }
    async changeInfo({ request, session, response, auth }) {
        try {
            let user = auth.user;
            if (user instanceof User_1.default) {
                const payload = await request.validate(UserInfoValidator_1.default);
                if (payload.image) {
                    await payload.image.move(Application_1.default.tmpPath('images'));
                    let newFileName = Helpers_1.string.generateRandom(50) + '.' + payload.image.extname;
                    await (0, gcs_1.uploadToImages)(Application_1.default.tmpPath(`images/${payload.image.clientName}`), newFileName);
                    user.image && (await (0, gcs_1.removeImage)(user.image.substring(user.image.lastIndexOf('/') + 1)));
                    user.image = (0, gcs_1.getImageLink)(newFileName);
                }
                user.firstName = payload.firstName;
                user.lastName = payload.lastName;
                await user.save();
                session.flash('messages', [
                    {
                        text: 'User profile successfuly updated',
                        type: 'success',
                    },
                ]);
                response.redirect().back();
            }
            else {
                throw new Error('User not found!');
            }
        }
        catch (e) {
            this.handelError(session, response, e);
        }
    }
    async addMedia({ auth, session, request, response }) {
        try {
            let user = auth.user;
            if (user instanceof User_1.default) {
                const payload = await request.validate(AddMediaValidator_1.default);
                var media = new Media_1.default();
                await payload.media.move(Application_1.default.tmpPath('videos'));
                let newFileName = Helpers_1.string.generateRandom(50) + '.' + payload.media.extname;
                await (0, gcs_1.uploadToVideos)(Application_1.default.tmpPath(`videos/${payload.media.clientName}`), newFileName);
                media.user_id = user.id + '';
                media.name = payload.name;
                media.singer = payload.singer;
                media.link = (0, gcs_1.getVideoLink)(newFileName);
                media.type = 'music';
                await media.save();
                session.flash('messages', [
                    {
                        text: 'Music added successfully!',
                        type: 'success',
                    },
                ]);
                response.redirect().back();
            }
            else {
                throw new Error('User not found!');
            }
        }
        catch (e) {
            this.handelError(session, response, e);
        }
    }
    async deleteMedia(ctx) {
        return this.musicValidator(ctx, async ({ session, response }, media) => {
            await (0, gcs_1.removeVideo)(media.link.substring(media.link.lastIndexOf('/') + 1));
            await media.delete();
            session.flash('messages', [
                {
                    text: 'Music deleted successfully!',
                    type: 'info',
                },
            ]);
            response.redirect().back();
        });
    }
    async musicValidator(ctx, fun) {
        try {
            let user = ctx.auth.user;
            var media = await Media_1.default.find(ctx.params.id);
            if (!(user instanceof User_1.default)) {
                throw new Error('User not found!');
            }
            else if (!media) {
                throw new Error('Music not found!');
            }
            else if (user.id !== parseInt(media.user_id)) {
                throw new Error('Music is not yours');
            }
            else {
                return await fun(ctx, media);
            }
        }
        catch (e) {
            this.handelError(ctx.session, ctx.response, e);
        }
    }
    async showMusic(ctx) {
        return this.musicValidator(ctx, ({ view }, media) => {
            return this.view(view, 'edit_video', {
                title: 'Edit music',
                media,
            });
        });
    }
    async editMusic(ctx) {
        return this.musicValidator(ctx, async ({ request, session, response }, media) => {
            const payload = await request.validate(EditMediaValidator_1.default);
            media.name = payload.name;
            media.singer = payload.singer;
            await media.save();
            session.flash('messages', [
                {
                    text: 'Music edited successfully!',
                    type: 'success',
                },
            ]);
            response.redirect().back();
        });
    }
}
exports.default = DashboardController;
//# sourceMappingURL=DashboardController.js.map