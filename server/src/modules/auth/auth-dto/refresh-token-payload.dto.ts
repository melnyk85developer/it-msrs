export type RefreshTokenPayloadType = {
    id: string;
    deviceId: string;
    roles: string[];
    banned: boolean;
    bannReason: string;
    iat: string;
};