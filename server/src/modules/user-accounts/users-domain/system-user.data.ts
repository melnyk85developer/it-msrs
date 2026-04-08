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

    @ApiProperty({ example: 'adminRoles', description: 'Роль или несколько ролей и полномочий пользователя админа в проекте.' })
    @Prop({ type: [Role], required: false })
    adminRoles: Role[]

    @ApiProperty({ example: 'isBanned', description: 'Является ли заблокированным в данный момент?' })
    @Prop({ type: Boolean, required: false })
    isBanned: boolean;

    @ApiProperty({ example: 'bannReason', description: 'Причина блокировки!' })
    @Prop({ type: String, required: false })
    bannReason: string | null;

    @ApiProperty({ example: 'Blockages', description: 'Блокировки пользователя в проекте.' })
    @Prop({ type: [Banneds], required: false })
    banneds: Banneds[]

    @ApiProperty({ example: 'true', description: 'Является ли аккаунт ботом?' })
    @Prop({ type: Boolean, required: false })
    isBot: boolean;

    @ApiProperty({ example: 'aiProvider', description: 'AI провайдер ассистента (если это бот)!' })
    @Prop({ type: String, nullable: true })
    provider1: string | null;

    @ApiProperty({ example: 'aiModel', description: 'AI модель ассистента (если это бот)!' })
    @Prop({ type: String, nullable: true })
    model1: string | null;

    @ApiProperty({ example: 'aiProvider', description: 'AI провайдер ассистента (если это бот)!' })
    @Prop({ type: String, nullable: true })
    provider2: string | null;

    @ApiProperty({ example: 'aiModel', description: 'AI модель ассистента (если это бот)!' })
    @Prop({ type: String, nullable: true })
    model2: string | null;

    @ApiProperty({ example: 'assistantRole', description: 'Роль Ассистента Терминатора.' })
    @Prop({ type: String, nullable: true })
    assistantRole: string | null;

    @ApiProperty({ example: 'assistantRole', description: 'Роль Ассистента Терминатора.' })
    @Prop({ type: Array, nullable: true })
    systemPrompts: string[] | null;
}
export const SystemUserSchema = SchemaFactory.createForClass(SystemUserData);