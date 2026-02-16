import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    _id: false,
})
export class MetaType {
    @Prop({ type: String, required: true })
    entityType: string;
    // entityType: 'post' | 'comment' | 'photo' | 'video';

    @Prop({ type: String, required: true })
    entityId: string;

    @Prop({ type: String, required: true })
    userId: string;
}

export const MetaTypeSchema = SchemaFactory.createForClass(MetaType);