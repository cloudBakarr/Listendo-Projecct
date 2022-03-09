"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class LoginValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.email()
            ]),
            password: Validator_1.schema.string({ trim: true }),
        });
        this.messages = {
            'email.required': 'Email is required',
            'email.email': `Email you've enterd isn't correct!`,
            'password.required': `Password is required`
        };
    }
}
exports.default = LoginValidator;
//# sourceMappingURL=LoginValidator.js.map