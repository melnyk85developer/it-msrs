import * as uuid from 'uuid';
import { Types } from "mongoose";
import { SETTINGS } from "src/core/settings";

export class ConstantsContextClass {
    public readonly buff2: Buffer;
    public readonly codedAuth: string;
    public readonly invalidToken: string;
    public readonly expiredToken: string;
    public readonly incorectData: any[];
    public readonly invalidId: string;
    public readonly randomId: string;
    public readonly userAgent: string[];
    public readonly refreshPayload: { id: Types.ObjectId, deviceId: string, roles: string[], banned: boolean, bannReason: string }
    public readonly accessPayload: { id: Types.ObjectId };

    constructor() {
        this.buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8');
        this.codedAuth = this.buff2.toString('base64');
        this.invalidToken = '245678901245678901123456';
        this.expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoicGFzc3dvcmQiLCJ1c2VySWQiOiI2NzJhMzdmMDkzZDUzMjFmNGZjNjE5M2UiLCJpYXQiOjE3MzA4MjAwODUsImV4cHI6MTczMDgyMDk4NX0.lpZlmruicYbzJ_y3k8rkyAYWnFlpwEhjG2e1K6jFGSk';
        this.incorectData = [undefined, null, NaN, {}, '@', '"', '&', '*', '(', ')', '=', '+', ';', ':', '<', '>', ',', '.', '`', '~', '!', '^', '$', '-', 'a', 'A'];
        this.invalidId = '66b9413d36f75d0b44ad1c5a';
        this.randomId = uuid.v4();
        this.refreshPayload = {
            id: new Types.ObjectId(),
            deviceId: this.randomId,
            roles: ['ADMIN'],
            banned: false,
            bannReason: ''
        }
        this.accessPayload = { id: new Types.ObjectId() }
    }
}