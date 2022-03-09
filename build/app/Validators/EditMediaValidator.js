"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class EditMediaValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            singer: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(3),
            ]),
            name: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(3),
            ])
        });
        this.messages = {
            'singer.minLength': 'Singer name must be at last 3 chars',
            'name.required': 'Name of music is required',
            'singer.required': 'Name of singer is required',
            'name.minLength': 'Name of music must be at last 3 chars'
        };
    }
}
exports.default = EditMediaValidator;
//# sourceMappingURL=EditMediaValidator.js.map