"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthMiddleware {
    constructor() {
        this.redirectTo = '/login';
    }
    async authenticate(auth, guards) {
        for (let guard of guards) {
            if (await auth.use(guard).check()) {
                auth.defaultGuard = guard;
                return true;
            }
        }
        return false;
    }
    async handle({ auth, session, response }, next, customGuards) {
        const guards = customGuards.length ? customGuards : [auth.name];
        let how = await this.authenticate(auth, guards);
        if (how) {
            await next();
        }
        else {
            session.flash('messages', [
                {
                    text: "You must login before continue!",
                    type: "warning"
                }
            ]);
            response.redirect().toRoute('LoginController.login');
        }
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map