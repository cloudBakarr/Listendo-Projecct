"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserInfoValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            lastName: Validator_1.schema.string({ trim: true }),
            firstName: Validator_1.schema.string({ trim: true }),
            image: Validator_1.schema.file.optional({
                size: '100mb',
                extnames: ['png', 'jpg', 'jpeg', 'apng', 'avif', 'gif', 'svg', 'webp'],
            })
        });
        this.messages = {
            'firstName.required': 'First Name is required',
            'lastName.required': 'Last Name is required',
            'image.size': 'Image size must not be more then 5MB!',
            'image.extname': 'Image type unkown!'
        };
    }
}
exports.default = UserInfoValidator;
//# sourceMappingURL=UserInfoValidator.js.map