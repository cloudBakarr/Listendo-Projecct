"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasesController_1 = __importDefault(require("./BasesController"));
const RegisterValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/RegisterValidator"));
const LoginValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/LoginValidator"));
const PasswordValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/PasswordValidator"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const template_variables_1 = __importDefault(require("../../../template-variables"));
const get_how_long_ago_1 = require("get-how-long-ago");
class LoginController extends BasesController_1.default {
    showLogin(ctx) {
        return this.view(ctx.view, 'login', {
            title: 'Login',
        });
    }
    async login({ request, auth, response, session }) {
        try {
            const payload = await request.validate(LoginValidator_1.default);
            await auth.use('web').attempt(payload.email, payload.password);
            session.flash('messages', [
                {
                    text: 'Welcome back',
                    type: 'info',
                },
            ]);
            response.redirect().toRoute('DashboardController.index');
        }
        catch (errors) {
            this.handelError(session, response, errors);
        }
    }
    async logout({ auth, response, }) {
        await auth.use('web').logout();
        response.redirect().toRoute('LoginController.showLogin');
    }
    showRegister(ctx) {
        return this.view(ctx.view, 'register', {
            title: 'Register',
        });
    }
    async register({ request, session, response, auth }) {
        var payload = null;
        try {
            payload = await request.validate(RegisterValidator_1.default);
            let user = new User_1.default();
            user.firstName = payload.firstName;
            user.lastName = payload.lastName;
            user.email = payload.email;
            user.password = await Hash_1.default.make(payload.password);
            user.email_verifid = true;
            user.verify_code = Helpers_1.string.generateRandom(50);
            user.verify_code_date = Date.now() + 1000 * 60 * 10 + '';
            await user.save();
            await auth.use('web').login(user);
            session.flash('messages', [
                {
                    text: `Hello and Welcome to ${template_variables_1.default.appName} app!`,
                    type: 'success',
                },
            ]);
            Event_1.default.emit('email:verify', { User: user, Vars: template_variables_1.default });
            response.redirect().toRoute('DashboardController.index');
        }
        catch (errors) {
            this.handelError(session, response, errors);
        }
    }
    async verify({ params, session, auth, response, view, request }) {
        let reset_password = request.qs().reset_password;
        let email = params.email;
        let code = params.code;
        const user = await User_1.default.findBy('email', email);
        if (user?.verify_code === code.trim() && parseInt(user.verify_code_date || '0') > Date.now()) {
            !reset_password &&
                session.flash('messages', [
                    {
                        text: `Your account has successfuly verified`,
                        type: 'success',
                    },
                ]);
            reset_password && session.flash('password_reset', true);
            user.email_verifid = true;
            user.verify_code = null;
            await user.save();
            await auth.use('web').login(user);
            if (reset_password) {
                response.redirect().toRoute('LoginController.setNewPassword');
            }
            else {
                response.redirect().toRoute('DashboardController.index');
            }
        }
        else {
            if (reset_password) {
                session.flash('messages', [
                    {
                        text: 'Reset password request failed! (your link is invalid or expired)',
                        type: 'danger',
                    },
                ]);
                response.redirect().toRoute('LoginController.showLogin');
            }
            else {
                return this.view(view, 'verify_fails', {
                    title: 'Verification failed!',
                });
            }
        }
    }
    async resend({ auth, session, response, request }, reset_password = false) {
        let user = auth.user;
        if (reset_password) {
            user = await User_1.default.findBy('email', request.input('email'));
        }
        if (user instanceof User_1.default) {
            let verify_code_date = parseInt(user.verify_code_date + '') || 0;
            if (verify_code_date < Date.now()) {
                user.verify_code = Helpers_1.string.generateRandom(50);
                user.verify_code_date = Date.now() + 1000 * 60 * 10 + '';
                await user.save();
                Event_1.default.emit(reset_password ? 'email:resendPassword' : 'email:verify', {
                    User: user,
                    Vars: template_variables_1.default,
                });
                session.flash('messages', [
                    {
                        text: `A new verofication link has sent to your email!`,
                        type: 'success',
                    },
                ]);
                response.redirect().back();
            }
            else {
                let until = 2 * Date.now() - verify_code_date;
                session.flash('messages', [
                    {
                        text: `You can't request for ${reset_password ? 'reset password' : 'resend'} until ${(0, get_how_long_ago_1.timeAgo)(until).string.replace('ago', '')}.`,
                        type: 'warning',
                    },
                ]);
                return response
                    .redirect()
                    .toRoute(`LoginController.${reset_password ? 'forgetPassword' : 'notVerified'}`);
            }
        }
        else {
            if (reset_password) {
                session.flash('messages', [
                    {
                        text: 'No account found with this email!',
                        type: 'warning',
                    },
                ]);
                response.redirect().back();
            }
            else {
                session.flash('messages', [
                    {
                        text: 'First log into your account!',
                        type: 'warning',
                    },
                ]);
                this.logout({ auth, response });
            }
        }
    }
    notVerified({ view }) {
        return this.view(view, 'not_verified', {
            title: 'Email Not Verified',
            type: 'warning',
        });
    }
    forgetPassword({ view }) {
        return this.view(view, 'reset_password', {
            title: 'Forget Password',
        });
    }
    async sendPasswordReset(ctx) {
        return this.resend(ctx, true);
    }
    setNewPassword({ session, view, response }) {
        if (session.flashMessages.get('password_reset', false)) {
            session.reflash();
            return this.view(view, 'reset_password_change', {
                title: 'Choose new password',
            });
        }
        else {
            response.redirect().toRoute('LoginController.showLogin');
        }
    }
    async changePasswors({ session, response, request, auth }) {
        if (session.flashMessages.get('password_reset', false)) {
            try {
                let payload = await request.validate(PasswordValidator_1.default);
                let user = auth.user;
                if (user instanceof User_1.default) {
                    user.password = await Hash_1.default.make(payload.password);
                    await user.save();
                    session.flash('messages', [
                        {
                            text: 'Your password successfuly set!',
                            type: 'success',
                        },
                    ]);
                    response.redirect().toRoute('DashboardController.index');
                }
                else {
                    throw new Error('User not found!');
                }
            }
            catch (errors) {
                session.reflash();
                return this.handelError(session, response, errors);
            }
        }
        else {
            response.redirect().toRoute('LoginController.showLogin');
        }
    }
}
exports.default = LoginController;
//# sourceMappingURL=LoginController.js.map