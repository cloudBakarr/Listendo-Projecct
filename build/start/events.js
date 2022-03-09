"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
function log(_) {
}
Event_1.default.on('email:verify', async ({ User, Vars }) => {
    try {
        await Mail_1.default.send((message) => {
            message
                .from(Application_1.default.env.get('SMTP_USERNAME', 'Video Manager'))
                .to(User.email)
                .subject('Verify your account!')
                .htmlView('emails/verify_email', {
                User,
                ...Vars,
            });
        });
    }
    catch (e) {
        log(e);
    }
});
Event_1.default.on('email:resendPassword', async ({ User, Vars }) => {
    try {
        await Mail_1.default.send((message) => {
            message
                .from(Application_1.default.env.get('SMTP_USERNAME', 'Video Manager'))
                .to(User.email)
                .subject('Reset password!')
                .htmlView('emails/reset_password', {
                User,
                ...Vars,
            });
        });
    }
    catch (e) {
        log(e);
    }
});
//# sourceMappingURL=events.js.map