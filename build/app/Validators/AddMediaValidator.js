"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class AddMediaValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            singer: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(3),
            ]),
            name: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(3),
            ]),
            media: Validator_1.schema.file({
                size: '200mb',
                extnames: [
                    'mp4',
                    'wav',
                    'mp3',
                    'ogg',
                    'ogv',
                    'oga',
                    'ogx',
                    'ogm',
                    'spx',
                    'opus',
                    'wave',
                    'mp4',
                    'm4a',
                    'm4p',
                    'm4b',
                    'm4r',
                    'm4v',
                    'caf',
                    'webm',
                ],
            }),
        });
        this.messages = {
            'media.required': 'Forget to choose your music',
            'media.size': 'Your music must not be more the 200MBs',
            'media.extname': 'Unsupported music type!',
            'singer.minLength': 'Singer name must be at last 3 chars',
            'name.required': 'Name of music is required',
            'singer.required': 'Name of singer is required',
            'name.minLength': 'Name of music must be at last 3 chars'
        };
    }
}
exports.default = AddMediaValidator;
//# sourceMappingURL=AddMediaValidator.js.map