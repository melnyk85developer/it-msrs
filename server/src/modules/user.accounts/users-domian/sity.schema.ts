import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    _id: false,
})
export class Sity {
    @Prop({ required: true })
    sityName: string;

    @Prop({ type: String, required: false, default: null })
    sityIndexPost: string | null;
}

export const SitySchema = SchemaFactory.createForClass(Sity);