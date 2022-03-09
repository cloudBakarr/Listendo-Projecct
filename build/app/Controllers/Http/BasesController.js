"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const template_variables_1 = __importDefault(require("../../../template-variables"));
class BasesController {
    async view(view, viewName, localVars = {}) {
        return view.render(viewName, {
            ...template_variables_1.default,
            ...localVars,
        });
    }
    handelError(session, response, errors) {
        if (errors.code === 'E_INVALID_AUTH_UID' || errors.code === 'E_INVALID_AUTH_PASSWORD') {
            errors.message = 'Your credentials does not match our records!';
        }
        session.flash('errors', errors.messages || errors.message);
        session.flashAll();
        response.redirect().back();
    }
}
exports.default = BasesController;
//# sourceMappingURL=BasesController.js.map