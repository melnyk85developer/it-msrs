"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailServiceMock = void 0;
const email_service_1 = require("../../src/modules/notifications/email.service");
class EmailServiceMock extends email_service_1.EmailService {
    async sendConfirmationEmail(email, code) {
        console.log('Call mock method sendConfirmationEmail / EmailServiceMock');
        return;
    }
}
exports.EmailServiceMock = EmailServiceMock;
//# sourceMappingURL=email-service.mock.js.map