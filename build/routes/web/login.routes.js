"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/login', 'LoginController.showLogin');
Route_1.default.post('/login', 'LoginController.login');
Route_1.default.post('/logout', 'LoginController.logout');
Route_1.default.get('/register', 'LoginController.showRegister');
Route_1.default.post('/register', 'LoginController.register');
Route_1.default.get('/set_new_password', 'LoginController.setNewPassword');
Route_1.default.post('/set_new_password', 'LoginController.changePasswors');
//# sourceMappingURL=login.routes.js.map