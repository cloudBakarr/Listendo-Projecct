"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class PasswordValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            password: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.minLength(6)
            ]),
        });
        this.messages = {
            'password.required': `Password is required`,
            'password.minLength': 'Password at last must be in length of 6'
        };
    }
}
exports.default = PasswordValidator;
//# sourceMappingURL=PasswordValidator.js.map