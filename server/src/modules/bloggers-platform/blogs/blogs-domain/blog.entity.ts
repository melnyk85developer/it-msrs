import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { UpdateBlogDto } from '../blogs-dto/create-blog.dto';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ApiProperty } from '@nestjs/swagger';
import { HomeDataPageBlog, HomeDataPageBlogSchema } from './homeEntityPageBlog';
import { AboutDataPageBlog, AboutSchema } from './about.schema';
import { UpdateHomePageBlogDto } from '../blogs-api/input-dto-blogs/update-HomePageblog-dto';

@Schema({
    // timestamps: true, 
    toJSON: { virtuals: true, versionKey: false }
})
export class Blog {
    @ApiProperty({ example: 'name', description: 'Имя блога.' })
    @Prop({ type: String, required: true })
    name: string;

    @ApiProperty({ example: 'description', description: 'Краткое описание блога.' })
    @Prop({ type: String, required: true })
    description: string;

    @ApiProperty({ example: 'websiteUrl', description: 'Адрес сайта.' })
    @Prop({ type: String, required: true })
    websiteUrl: string;

    @ApiProperty({ example: 'createdAt', description: 'Дата создания блога.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Дата последнего обновления блога.' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'isMembership', description: 'Является членством?' })
    @Prop({ type: Boolean, required: true })
    isMembership: boolean;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор владельца блога!' })
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @ApiProperty({ example: 'deletedAt', description: 'Является ли блог удаленным?' })
    @Prop({ type: String, required: false, nullable: true })
    deletedAt: string | null;

    @ApiProperty({ example: 'рomeDataPageBlog', description: 'Данные главной страницы блога.' })
    @Prop({ type: HomeDataPageBlogSchema, required: true })
    homeDataPageBlog: HomeDataPageBlog;

    @ApiProperty({ example: 'about', description: 'Данные страницы о нас в блоге.' })
    @Prop({ type: AboutSchema, required: true })
    aboutDataPageBlog: AboutDataPageBlog;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }
    static createBlogInstance(dto: Omit<CreateBlogDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): BlogDocument {
        // console.log('BlogsEntity: createInstance - dto 😡 ', dto)
        const blog = new this();

        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        blog.userId = dto.userId;
        blog.isMembership = false;
        blog.createdAt = new Date().toISOString();
        blog.updatedAt = new Date().toISOString();
        blog.deletedAt = null;

        blog.homeDataPageBlog = {
            titleHome: null,
            subtitleHome: null,
            contentHome: null,
            ctaTextHome: null,
            ctaLinkHome: null,
            seoDescriptionHome: null
        }

        blog.aboutDataPageBlog = {
            titleAbout: null,
            subtitleAbout: null,
            contentAbout: null,
            missionAbout: null,
            seoDescriptionAbout: null
        }

        // console.log('BlogsEntity: createInstance - blog 😡 ', blog)
        return blog as BlogDocument;
    }
    updateBlogData(dto: Omit<UpdateBlogDto, 'updatedAt'>) {
        if (this.id === dto.id) {
            this.name = dto.name === undefined ? this.name : dto.name;
            this.description = dto.description === undefined ? this.description : dto.description;
            this.websiteUrl = dto.websiteUrl === undefined ? this.websiteUrl : dto.websiteUrl;
            this.userId = dto.userId === undefined ? this.userId : dto.userId;
            this.isMembership = dto.isMembership === undefined ? this.isMembership : dto.isMembership;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt;

            this.homeDataPageBlog.titleHome = dto.titleHome === undefined ? this.homeDataPageBlog.titleHome : dto.titleHome
            this.homeDataPageBlog.subtitleHome = dto.subtitleHome === undefined ? this.homeDataPageBlog.subtitleHome : dto.subtitleHome
            this.homeDataPageBlog.contentHome = dto.contentHome === undefined ? this.homeDataPageBlog.contentHome : dto.contentHome
            this.homeDataPageBlog.ctaTextHome = dto.ctaTextHome === undefined ? this.homeDataPageBlog.ctaTextHome : dto.ctaTextHome
            this.homeDataPageBlog.ctaLinkHome = dto.ctaLinkHome === undefined ? this.homeDataPageBlog.ctaLinkHome : dto.ctaLinkHome
            this.homeDataPageBlog.seoDescriptionHome = dto.seoDescriptionHome === undefined ? this.homeDataPageBlog.seoDescriptionHome : dto.seoDescriptionHome

            this.aboutDataPageBlog.titleAbout = dto.titleAbout === undefined ? this.aboutDataPageBlog.titleAbout : dto.titleAbout
            this.aboutDataPageBlog.subtitleAbout = dto.subtitleAbout === undefined ? this.aboutDataPageBlog.subtitleAbout : dto.subtitleAbout
            this.aboutDataPageBlog.contentAbout = dto.contentAbout === undefined ? this.aboutDataPageBlog.contentAbout : dto.contentAbout
            this.aboutDataPageBlog.missionAbout = dto.missionAbout === undefined ? this.aboutDataPageBlog.missionAbout : dto.missionAbout
            this.aboutDataPageBlog.seoDescriptionAbout = dto.seoDescriptionAbout === undefined ? this.aboutDataPageBlog.seoDescriptionAbout : dto.seoDescriptionAbout
        }
    }
    updateHomePageBlogData(dto: UpdateHomePageBlogDto) {
        if (dto.id !== this.id) {
            // this.name = dto.name === undefined ? this.name : dto.name;
            // this.description = dto.description === undefined ? this.description : dto.description;
            // this.websiteUrl = dto.websiteUrl === undefined ? this.websiteUrl : dto.websiteUrl;
            // this.isMembership = dto.isMembership === undefined ? this.isMembership : dto.isMembership;
            // this.updatedAt = new Date().toISOString();
            // this.deletedAt = dto.deletedAt === undefined ? this.deletedAt : dto.deletedAt;

            this.homeDataPageBlog.titleHome = dto.titleHome === undefined ? this.homeDataPageBlog.titleHome : dto.titleHome
            this.homeDataPageBlog.subtitleHome = dto.subtitleHome === undefined ? this.homeDataPageBlog.subtitleHome : dto.subtitleHome
            this.homeDataPageBlog.contentHome = dto.contentHome === undefined ? this.homeDataPageBlog.contentHome : dto.contentHome
            this.homeDataPageBlog.ctaTextHome = dto.ctaTextHome === undefined ? this.homeDataPageBlog.ctaTextHome : dto.ctaTextHome
            this.homeDataPageBlog.ctaLinkHome = dto.ctaLinkHome === undefined ? this.homeDataPageBlog.ctaLinkHome : dto.ctaLinkHome
            this.homeDataPageBlog.seoDescriptionHome = dto.seoDescriptionHome === undefined ? this.homeDataPageBlog.seoDescriptionHome : dto.seoDescriptionHome

            this.aboutDataPageBlog.titleAbout = dto.titleAbout === undefined ? this.aboutDataPageBlog.titleAbout : dto.titleAbout
            this.aboutDataPageBlog.subtitleAbout = dto.subtitleAbout === undefined ? this.aboutDataPageBlog.subtitleAbout : dto.subtitleAbout
            this.aboutDataPageBlog.contentAbout = dto.contentAbout === undefined ? this.aboutDataPageBlog.contentAbout : dto.contentAbout
            this.aboutDataPageBlog.missionAbout = dto.missionAbout === undefined ? this.aboutDataPageBlog.missionAbout : dto.missionAbout
            this.aboutDataPageBlog.seoDescriptionAbout = dto.seoDescriptionAbout === undefined ? this.aboutDataPageBlog.seoDescriptionAbout : dto.seoDescriptionAbout
        }
    }
    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new DomainException(INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID)
        }
        this.deletedAt = new Date().toISOString();
    }
}
export const BlogSchema = SchemaFactory.createForClass(Blog);
//регистрирует методы сущности в схеме
BlogSchema.loadClass(Blog);
// Подключает виртуально BlogSchema в UserSchema
BlogSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'postId',
});
//Типизация документа
export type BlogDocument = HydratedDocument<Blog>;
//Типизация модели + статические методы
export type BlogModelType = Model<BlogDocument> & typeof Blog;