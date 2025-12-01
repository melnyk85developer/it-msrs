import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({
    _id: false,
})
export class Confirmation {
    @ApiProperty({ example: 'confirmationCode', description: 'Код подверждения.' })
    @Prop({ type: String, required: true }) // unique: true
    confirmationCode: string;

    @ApiProperty({ example: 'expirationDate', description: 'Срок годности.' })
    @Prop({ type: String, required: true }) // unique: true
    expirationDate: Date;

    @ApiProperty({ example: 'isBlocked', description: 'Стоит ли блокировка.' })
    @Prop({ type: String, required: true }) // unique: true
    isBlocked: boolean;

    @ApiProperty({ example: 'field', description: 'Поле сущьности с которой работает подтверждение.' })
    @Prop({ type: String, required: true }) // unique: true
    field: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя который совершает подтверждение.' })
    @Prop({ type: String, required: true }) // unique: true
    userId: number;
}
export const ConfirmationSchema = SchemaFactory.createForClass(Confirmation);
ConfirmationSchema.loadClass(Confirmation);
export type ConfirmationDocument = HydratedDocument<Confirmation>;
export type ConfirmationModelType = Model<ConfirmationDocument> & typeof Confirmation;