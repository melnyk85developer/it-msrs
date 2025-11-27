import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
    // timestamps: true, 
    toJSON: { virtuals: true }
})
export class Confirmation {
    @Prop({ type: String, required: true })
    confirmationCode: string;

    @Prop({ type: Boolean, required: false })
    isBlocked: boolean;

    @Prop({ type: String, required: false })
    field: string;

    // @Prop({ type: String, required: true })
    // userId: string;

    @Prop({ type: Date, required: false })
    lastActiveDate?: Date | null;

    @Prop({ type: Date, required: true })
    expirationDate: Date | null;
}
export const ConfirmationSchema = SchemaFactory.createForClass(Confirmation);