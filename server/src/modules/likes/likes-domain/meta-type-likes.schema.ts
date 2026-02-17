import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    _id: false,
})
export class MetaType {
    @Prop({ type: String, required: true })
    entityType: string;

    @Prop({ type: String, required: true })
    entityId: string;

    @Prop({ type: String, required: true })
    userId: string;
}

export const MetaTypeSchema = SchemaFactory.createForClass(MetaType);
// entityType: 'post' | 'comment' | 'photo' | 'video';