import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const loginConstraints = {
    minLength: 3,
    maxLength: 10,
};

export const passwordConstraints = {
    minLength: 6,
    maxLength: 20,
};

export const emailConstraints = {
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};
@Schema({
    _id: false,
})
export class AccountData {
    @ApiProperty({ example: 'userName', description: 'Имя пользователя.' })
    @Prop({ type: String, required: true }) // unique: true
    userName: string;

    @ApiProperty({ example: 'passwordHash', description: 'Хешь пароля пользователя.' })
    @Prop({ type: String, required: true })
    passwordHash: string;

    @ApiProperty({ example: 'email', description: 'E-mail адрес пользоателя.' })
    @Prop({ type: String, min: 5, required: true }) // unique: true
    email: string;

    @ApiProperty({ example: 'createdAt', description: 'Число создания аккаунта.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления аккаунта.' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления  аккаунта.' })
    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    @Prop({ type: Boolean, required: true, default: false })
    isEmailConfirmed: boolean;

    @ApiProperty({ example: 'lastSeen', description: 'Последнее посещение пользователя.' })
    @Prop({ type: String, required: false })
    lastSeen: string
}

export const AccountDataSchema = SchemaFactory.createForClass(AccountData);