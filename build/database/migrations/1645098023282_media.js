"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Media extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'media';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.bigInteger('user_id')
                .unsigned()
                .references('users.id')
                .onDelete('CASCADE')
                .notNullable();
            table.string('link').notNullable();
            table.string('name').notNullable();
            table.string('singer').nullable();
            table.enum('type', ['music', 'video']).notNullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Media;
//# sourceMappingURL=1645098023282_media.js.map