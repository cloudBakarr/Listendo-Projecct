"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Users extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.string('image').nullable();
            table.json('google_object').nullable();
            table.json('facebook_object').nullable();
            table.string('login_token').nullable();
            table.boolean('email_verifid').nullable().defaultTo(false);
            table.string('verify_code').nullable();
            table.string('verify_code_date').nullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Users;
//# sourceMappingURL=1645096810058_users.js.map