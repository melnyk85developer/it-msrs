import * as uuid from 'uuid';
import * as fs from 'fs';
import path from 'path';
import { ReadStream } from 'fs';
import { Types } from "mongoose";
import { SETTINGS } from "src/core/settings";
import { Photo } from 'src/modules/gallery/photos/photos-domain/photos-entity';
import { PhotoViewDto } from 'src/modules/gallery/photos/photos-dto/photo-view-dto';

export class ConstantsContextClass {
    public readonly buff2: Buffer;
    public readonly codedAuth: string;
    public readonly invalidToken: string;
    public readonly expiredToken: string;
    public readonly incorectData: any[];
    public readonly invalidId: string;
    public readonly randomId: string;
    public readonly userAgent: string[];
    public readonly image1: ReadStream;
    public readonly image2: ReadStream;
    public createdPhoto1: PhotoViewDto | null
    public createdPhoto2: PhotoViewDto | null
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
        this.image1 = fs.createReadStream(
            path.join(__dirname, '../../img/kazan.jpg')
        );
        this.image2 = fs.createReadStream(
            path.join(__dirname, '../../img/kazan24.jpg')
        );
        this.createdPhoto1 = null;
        this.createdPhoto2 = null;
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