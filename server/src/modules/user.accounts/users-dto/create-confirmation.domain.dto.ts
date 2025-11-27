import { Types } from "mongoose";

export class CreateConfirmationDomainDto {
    confirmationCode: string;
    isBlocked: boolean;
    field: string;
    userId: string;
    lastActiveDate: Date | null;
    expirationDate: Date | null;
}