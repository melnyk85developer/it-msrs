import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
    // timestamps: true,
    _id: false,
    toJSON: { virtuals: true }
})
export class Role {
    // @ApiProperty({ example: '1', description: 'Уникальный идентификатор роли' })
    // @Prop({ type: String, required: true })
    // id: string;

    @ApiProperty({ example: 'ADMIN', description: 'Уникальное значение роли' })
    @Prop({ type: String, required: true, enum: ['ADMIN', 'USER', 'MODERATOR'], })
    value: string;

    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    @Prop({ type: String, required: true })
    description: string;
}
export const RoleSchema = SchemaFactory.createForClass(Role);