import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
    @Prop({ type: String, required: true }) // unique: true
    userName: string;

    @Prop({ type: String, required: true })
    passwordHash: string;

    @Prop({ type: String, min: 5, required: true }) // unique: true
    email: string;

    @Prop({ type: String, required: true })
    createdAt: string;

    @Prop({ type: String, required: false })
    updatedAt: string;

    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    @Prop({ type: Boolean, required: true, default: false })
    isEmailConfirmed: boolean;
}

export const AccountDataSchema = SchemaFactory.createForClass(AccountData);