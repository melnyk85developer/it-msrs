import { EmailService } from '../../src/modules/notifications/email.service';
export declare class EmailServiceMock extends EmailService {
    sendConfirmationEmail(email: string, code: string): Promise<void>;
}
