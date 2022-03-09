"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ChangePasswordValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            oldPassword: Validator_1.schema.string({ trim: true }),
            newPassword: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.minLength(6)
            ]),
        });
        this.messages = {
            'oldPassword.required': 'Your current password is required!',
            'newPassword.required': 'How you want to change your password without inserting new password?',
            'newPassword.minLength': 'Your new password length is less then 6!',
        };
    }
}
exports.default = ChangePasswordValidator;
//# sourceMappingURL=ChangePasswordValidator.js.map