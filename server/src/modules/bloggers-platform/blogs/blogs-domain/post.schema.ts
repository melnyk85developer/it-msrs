import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    _id: false,
})
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ type: String, required: false, default: null })
    content: string | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);