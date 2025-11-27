import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
    // timestamps: true, 
    // _id: false,
    toJSON: { virtuals: true }
})
export class Banneds {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор блокировки.' })
    @Prop({ type: String, required: true })
    id: string;

    @ApiProperty({ example: 'banned', description: 'Причина блокировки!' })
    @Prop({ type: Boolean, required: true })
    banned: boolean;

    @ApiProperty({ example: 'bannReason', description: 'Причина блокировки!' })
    @Prop({ type: String, required: true })
    bannReason: string;

    @ApiProperty({ example: 'lastActiveDate', description: 'Дата начала блокировки!' })
    @Prop({ type: String, required: true })
    lastBlokedDate: string;

    @ApiProperty({ example: 'expirationDate', description: 'Дата окончания блокировки!' })
    @Prop({ type: String, required: true })
    expirationDate: string;
}
export const BannedsSchema = SchemaFactory.createForClass(Banneds);