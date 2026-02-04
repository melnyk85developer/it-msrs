import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSessionDomainDto, UpdateSessionDto } from '../sessions-dto/create-sessions.domain.dto';

@Schema({
    // timestamps: true, 
    // _id: false,
    toJSON: { virtuals: true, versionKey: false }
})
export class Session {
    @ApiProperty({ example: '192.168.1.1', description: 'IP адрес пользователя' })
    @Prop({ type: String, required: false, nullable: true })
    ip: string | null;

    @ApiProperty({ example: 'Chrome or FireFox', description: 'Название браузера' })
    @Prop({ type: String, required: false, nullable: true })
    browserName: string | null;

    @ApiProperty({ example: '134.0.0.0', description: 'Версия устройства' })
    @Prop({ type: String, required: false, nullable: true })
    browserVersion: string | null;

    @ApiProperty({ example: 'Linux or Windows', description: 'Название Операционной системы' })
    @Prop({ type: String, required: false, nullable: true })
    osName: string | null;

    @ApiProperty({ example: 'Linux Ubuntu or Windows10', description: 'Версия Операционной сстемы' })
    @Prop({ type: String, required: false, nullable: true })
    osVersion: string | null;

    @ApiProperty({ example: 'Linux Ubuntu or Windows10', description: 'Версия Операционной сстемы' })
    @Prop({ type: String, required: false, nullable: true })
    device: string | null;

    @ApiProperty({ example: 'Ukraine', description: 'Страна' })
    @Prop({ type: String, required: false, nullable: true })
    country: string | null;

    @ApiProperty({ example: 'Kiev', description: 'Город' })
    @Prop({ type: String, required: false, nullable: true })
    city: string | null;

    @ApiProperty({ example: '123', description: 'Уникальный идентификатор пользователя' })
    @Prop({ type: String, required: true })
    userId: string;

    @ApiProperty({ example: 'device123', description: 'Уникальный идентификатор устройства' })
    @Prop({ type: String, required: true })
    deviceId: string;

    @ApiProperty({ example: '2025-04-07T12:34:56Z', description: 'Дата создания сессии' })
    @Prop({ type: Number, required: true })
    lastActiveDate: number;

    @ApiProperty({ example: '2025-04-08T12:34:56Z', description: 'Дата окончания сессии' })
    @Prop({ type: Number, required: true })
    expirationDate: number;

    @ApiProperty({ example: 'Чекбокс Запомнить меня', description: 'Отмеченый чекбокс 30д. жизни рефрешь токена, не отмеченый 1 сутки жизни рефрешь токена!!!' })
    @Prop({ type: Boolean, required: false })
    remember: boolean;

    static async createSessionInstance(dto: CreateSessionDomainDto): Promise<SessionDocument> {
        const session = new this();
        // console.log('SessionEntity: createInstance - session 😡 ', session)
        session.ip = dto.ip,
            session.browserName = dto.browserName,
            session.browserVersion = dto.browserVersion,
            session.osName = dto.osName,
            session.osVersion = dto.osVersion,
            session.country = dto.country,
            session.city = dto.city,
            session.userId = dto.userId,
            session.deviceId = dto.deviceId,
            session.device = dto.device,
            session.expirationDate = dto.expirationDate,
            session.lastActiveDate = dto.lastActiveDate
            session.remember = dto.remember
        return session as SessionDocument;
    }
    async updateSessionData(dto: Omit<UpdateSessionDto, 'deletedAt' | 'updatedAt'>) {
        // console.log('🔥🔥🔥 updateSessionData - dto', dto);
        // console.log('🔥🔥🔥 updateSessionData - this', this);
        if (dto.deviceId === this.deviceId) {
            // console.log('🔥🔥🔥 updateSessionData - dto.deviceId !== this.deviceId:', dto.deviceId !== this.deviceId);
            this.ip = dto.ip;
            this.browserName = dto.browserName;
            this.browserVersion = dto.browserVersion;
            this.osName = dto.osName;
            this.osVersion = dto.osVersion;
            this.country = dto.country;
            this.city = dto.city;
            this.deviceId = dto.deviceId;
            this.device = dto.device;
            this.lastActiveDate = dto.lastActiveDate;
            this.expirationDate = dto.expirationDate;
            this.remember = dto.remember;
        }
    }
}
export const SessionSchema = SchemaFactory.createForClass(Session);
//регистрирует методы сущности в схеме
SessionSchema.loadClass(Session);
//Типизация документа
export type SessionDocument = HydratedDocument<Session>;
//Типизация модели + статические методы
export type SessionModelType = Model<SessionDocument> & typeof Session;