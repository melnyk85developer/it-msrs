import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    _id: false,
})
export class AboutDataPageBlog {
    @Prop({ type: String, required: false, default: null })
    titleAbout: string | null;

    @Prop({ type: String, required: false, default: null })
    subtitleAbout: string | null;

    @Prop({ type: String, required: false, default: null })
    contentAbout: string | null;

    // Опционально, но очень полезно
    @Prop({ type: String, required: false, default: null })
    missionAbout: string | null;

    @Prop({ type: String, required: false, default: null })
    seoDescriptionAbout: string | null;
}

export const AboutSchema = SchemaFactory.createForClass(AboutDataPageBlog);