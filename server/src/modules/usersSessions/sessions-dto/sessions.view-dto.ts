import { OmitType } from "@nestjs/swagger";
import { SessionDocument } from "../sessions-domain/sessions.entity";

export class SessionViewDto {
    ip: string | null;
    browserName: string | null;
    browserVersion: string | null;
    osName: string | null;
    osVersion: string | null;
    device: string | null;
    country: string | null;
    city: string | null;
    userId: string;
    deviceId: string;
    lastActiveDate: number;
    expirationDate: number;

    static mapToView(session: SessionDocument): SessionViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new SessionViewDto();

        // dto.id = session._id.toString();
        dto.ip = session.ip;
        dto.browserName = session.browserName;
        dto.browserVersion = session.browserVersion;
        dto.osName = session.osName;
        dto.osVersion = session.osVersion;
        dto.device = session.device;
        dto.country = session.country;
        dto.city = session.city;
        dto.userId = session.userId;
        dto.deviceId = session.deviceId;
        dto.lastActiveDate = session.lastActiveDate;
        dto.expirationDate = session.expirationDate;

        // console.log('UsersController: mapToView - dto 😡 ', dto)

        return dto;
    }
}