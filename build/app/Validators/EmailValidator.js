"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class EmailValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({});
        this.messages = {};
    }
}
exports.default = EmailValidator;
//# sourceMappingURL=EmailValidator.js.map