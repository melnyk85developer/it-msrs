import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ApiProperty } from '@nestjs/swagger';
import { RequestLimitDomainDto } from '../request-limit-dto/request-limit-domain.dto';

@Schema({
    // timestamps: true, 
    // _id: false,
    collection: 'global-rate-limit',
    toJSON: { virtuals: true, versionKey: false }
})
export class GlobalRateLimit {
    @ApiProperty({ example: '192.168.1.1', description: 'IP адрес пользователя' })
    @Prop({ type: String, required: false, nullable: true })
    IP: string | null;

    @ApiProperty({ example: '/profile', description: 'URL страницы' })
    @Prop({ type: String, required: false, nullable: true })
    URL: string | null;

    @ApiProperty({ example: '134.0.0.0', description: 'Версия устройства' })
    @Prop({ type: Date, required: true })
    date: Date;

    static async createGlobalRateLimitInstance(dto: RequestLimitDomainDto): Promise<GlobalRateLimitDocument> {
        const limit = new this();
        limit.IP = dto.IP;
        limit.URL = dto.URL;
        limit.date = dto.date;
        return limit as GlobalRateLimitDocument;
    }
}
export const GlobalRateLimitSchema = SchemaFactory.createForClass(GlobalRateLimit);
//регистрирует методы сущности в схеме
GlobalRateLimitSchema.loadClass(GlobalRateLimit);
// Подключает виртуально BlogSchema в UserSchema
GlobalRateLimitSchema.virtual('blogs', {
    ref: 'Blog',
    localField: '_id',
    foreignField: 'blogId',
});
//Типизация документа
export type GlobalRateLimitDocument = HydratedDocument<GlobalRateLimit>;
//Типизация модели + статические методы
export type GlobalRateLimitModelType = Model<GlobalRateLimitDocument> & typeof GlobalRateLimit;