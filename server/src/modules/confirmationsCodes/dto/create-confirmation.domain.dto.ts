import { Types } from "mongoose";

export class CreateConfirmationDomainDto {
    confirmationCode: string;
    minutes: number;
    isBlocked: boolean;
    isCooldown: boolean;
    field: string;
    userId: string;
    add: string;
    expirationDate: string;
}