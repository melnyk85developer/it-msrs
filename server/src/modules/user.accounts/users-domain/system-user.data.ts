import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './roles-user.data';
import { Banneds } from './all-banneds-user.data';

@Schema({
    // timestamps: true, 
    _id: false,
    toJSON: { virtuals: true }
})
export class SystemUserData {
    @ApiProperty({ example: 'default: false', description: 'Активирован ли аккаунт' })
    @Prop({ type: Boolean, required: true, default: false })
    isEmailConfirmed: boolean;

    @ApiProperty({ example: 'Roles', description: 'Роль или несколько ролей и полномочий пользователя в проекте.' })
    @Prop({ type: [Role], required: false })
    roles: Role[]

    @ApiProperty({ example: 'isBanned', description: 'Является ли заблокированным в данный момент?' })
    @Prop({ type: Boolean, required: false })
    isBanned: boolean;

    @ApiProperty({ example: 'true', description: 'Является ли аккаунт ботом?' })
    @Prop({ type: Boolean, required: false })
    isBot: boolean;

    @ApiProperty({ example: 'bannReason', description: 'Причина блокировки!' })
    @Prop({ type: String, required: false })
    bannReason: string | null;

    @ApiProperty({ example: 'Blockages', description: 'Блокировки пользователя в проекте.' })
    @Prop({ type: [Banneds], required: false })
    banneds: Banneds[]
}
export const SystemUserSchema = SchemaFactory.createForClass(SystemUserData);