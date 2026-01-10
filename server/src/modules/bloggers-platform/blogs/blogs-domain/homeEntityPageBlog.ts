import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    _id: false,
})
export class HomeDataPageBlog {
    // HERO
    @Prop({ type: String, required: false, default: null })
    titleHome: string | null;

    @Prop({ type: String, required: false, default: null })
    subtitleHome: string | null;

    // ОСНОВНОЙ КОНТЕНТ
    @Prop({ type: String, required: false, default: null })
    contentHome: string | null;

    // CTA
    @Prop({ type: String, required: false, default: null })
    ctaTextHome: string | null;

    @Prop({ type: String, required: false, default: null })
    ctaLinkHome: string | null;

    // SEO
    @Prop({ type: String, required: false, default: null })
    seoDescriptionHome: string | null;
}

export const HomeDataPageBlogSchema = SchemaFactory.createForClass(HomeDataPageBlog);