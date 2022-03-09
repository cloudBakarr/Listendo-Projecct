"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.get('/', 'DashboardController.index');
    Route_1.default.get('/settings', 'DashboardController.showSettings');
    Route_1.default.post('/change_info', 'DashboardController.changeInfo');
    Route_1.default.post('/change_password', 'DashboardController.changePassword');
    Route_1.default.post('/add', 'DashboardController.addMedia');
    Route_1.default.get('/delete/:id', 'DashboardController.deleteMedia');
    Route_1.default.get('/edit/:id', 'DashboardController.showMusic');
    Route_1.default.post('/edit/:id', 'DashboardController.editMusic');
}).middleware(['auth', 'verified']).prefix('/dashboard');
//# sourceMappingURL=dashboard.routes.js.map