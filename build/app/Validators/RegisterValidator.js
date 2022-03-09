"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class RegisterValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            lastName: Validator_1.schema.string({ trim: true }),
            firstName: Validator_1.schema.string({ trim: true }),
            email: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.email(),
                Validator_1.rules.unique({
                    table: "users",
                    column: "email"
                })
            ]),
            password: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.minLength(6)
            ])
        });
        this.messages = {
            'firstName.required': 'First Name is required',
            'lastName.required': 'Last Name is required',
            'email.required': 'Email is required',
            'email.email': `Email you've enterd isn't correct!`,
            'email.unique': `Email is already in use!`,
            'password.required': `Password is required`,
            'password.minLength': 'Password at last must be in length of 6'
        };
    }
}
exports.default = RegisterValidator;
//# sourceMappingURL=RegisterValidator.js.map