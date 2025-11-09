import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    _id: false,
})
export class CommentatorInfo {
    @Prop({ required: true })
    userId: string;

    @Prop({ type: String, required: false, default: null })
    userLogin: string;
}

export const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);