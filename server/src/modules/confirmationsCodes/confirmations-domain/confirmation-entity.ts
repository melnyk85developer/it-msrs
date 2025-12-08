import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateConfirmationDomainDto } from '../dto/create-confirmation.domain.dto';
import { add } from "date-fns";
import { UodateConfDto } from '../dto/confDto';

@Schema({
    // _id: false,
    toJSON: { virtuals: true }
})
export class Confirmation {
    @ApiProperty({ example: 'confirmationCode', description: 'Код подверждения.' })
    @Prop({ type: String, required: true }) // unique: true
    confirmationCode: string;

    @ApiProperty({ example: 'expirationDate', description: 'Срок годности.' })
    @Prop({ type: String, required: true }) // unique: true
    expirationDate: string;

    @ApiProperty({ example: 'isBlocked', description: 'Стоит ли блокировка.' })
    @Prop({ type: Boolean, required: true }) // unique: true
    isBlocked: boolean;

    @ApiProperty({ example: 'isBlocked', description: 'Стоит ли блокировка.' })
    @Prop({ type: Boolean, required: true }) // unique: true
    isCooldown: boolean

    @ApiProperty({ example: 'field', description: 'Поле сущьности с которой работает подтверждение.' })
    @Prop({ type: String, required: true }) // unique: true
    field: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя который совершает подтверждение.' })
    @Prop({ type: String, required: true }) // unique: true
    userId: string;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static async createConfirmationInstance(dto: Omit<CreateConfirmationDomainDto, 'expirationDate'>): Promise<ConfirmationDocument> {
        const confirmation = new this();
        confirmation.confirmationCode = dto.confirmationCode
        confirmation.expirationDate = add(dto.add, {
            minutes: dto.minutes
        }).toISOString()
        confirmation.isCooldown = dto.isCooldown
        confirmation.isCooldown = dto.isCooldown
        confirmation.isBlocked = dto.isBlocked
        confirmation.field = dto.field
        confirmation.userId = dto.userId
        // console.log('ConfirmationEntity: createInstance - confirmation 😡 ', confirmation)
        return confirmation as ConfirmationDocument;
    }
    updateConfirmationDate(dto: UodateConfDto) {
        if (dto.id === this.id) {
            this.confirmationCode = dto.confirmationCode
            this.expirationDate = add(dto.add, {
                minutes: dto.minutes
            }).toISOString()
            this.isBlocked = dto.isBlocked
            this.isCooldown = dto.isCooldown
            this.field = dto.field
            this.userId = dto.userId
        }
    }
    updateBlocked(id: string, isBlocked: boolean) {
        if (id === this.id) {
            this.isBlocked = isBlocked
        }
    }
}
export const ConfirmationSchema = SchemaFactory.createForClass(Confirmation);
ConfirmationSchema.loadClass(Confirmation);
export type ConfirmationDocument = HydratedDocument<Confirmation>;
export type ConfirmationModelType = Model<ConfirmationDocument> & typeof Confirmation;