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
    @ApiProperty({ example: 'login', description: 'login пользователя.' })
    @Prop({ type: String, required: true, unique: true }) // unique: true
    login: string;

    @ApiProperty({ example: 'email', description: 'E-mail адрес пользоателя.' })
    @Prop({ type: String, min: 5, required: true, unique: true }) // unique: true
    email: string;
}

export const AccountDataSchema = SchemaFactory.createForClass(AccountData);