import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreatePostForProfileDomainDto } from "../posts-dto/posts.dto";
import { UpdatePostForProfileDomainDto, UpdatePostForProfileDto } from "../posts-for-profile-api/posts-for-profile-input-dto/posts-update.input-dto";
import { AuthorPost, AuthorPostSchema } from "./author-post-shema";

@Schema({
    // timestamps: true,
    collection: 'posts_for_profile',
    toJSON: { virtuals: true, versionKey: false }
})
export class PostForProfile {
    @ApiProperty({ example: 'Война в Украине закончилась', description: 'Заголовок' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    title: string;

    @ApiProperty({ example: 'Контент', description: 'Текст поста' })
    @Prop({ type: String, required: true }) // unique: true
    content: string;

    @ApiProperty({ example: 'qwerty.jpg', description: 'Название изображения' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    image: string | null

    @ApiProperty({
        example: 'id пользователя который выложил пост',
        description: 'Уникальный идентификатор пользователя'
    })
    @Prop({ type: String, required: true }) // unique: true
    userId: string;

    @ApiProperty({
        example: 'id пользователя, у которого выложили пост',
        description: 'Уникальный идентификатор пользователя'
    })
    @Prop({ type: String, required: true }) // unique: true
    profileId: string;

    @ApiProperty({ example: 'pin true', description: 'Запинен пост или нет' })
    @Prop({ type: Boolean, required: false, }) // unique: true
    pin: boolean;

    @ApiProperty({ example: 'createdAt', description: 'Число создания поста.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления поста.' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления поста.' })
    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createPostForProfileInstance(dto: Omit<CreatePostForProfileDomainDto, 'pin' | 'createdAt' | 'updatedAt' | 'deletedAt'>): PostForProfileDocument {
        // console.log('TokenEntity: createTokenInstance - dto 😡 ', dto)
        const post = new this();
        const date = new Date();
        const createdAt = date.toISOString();

        post.title = dto.title
        post.content = dto.content
        post.image = dto.image
        post.userId = dto.userId;
        post.profileId = dto.profileId
        post.pin = false
        // post.authorPost = dto.authorPost
        post.createdAt = createdAt
        post.updatedAt = createdAt
        post.deletedAt = null

        // console.log('PostForProfile: createInstance - post 😡 ', post)
        return post as PostForProfileDocument;
    }
    updatePostForProfile(dto: UpdatePostForProfileDomainDto) {
        if (this.id === dto.postId) {
            this.title = dto.title
            this.content = dto.content
            this.image = dto.image ? dto.image : this.image
            this.userId = dto.userId;
            this.profileId = dto.profileId
            this.pin = this.pin
            this.createdAt = this.createdAt
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt
        }
    }
    makeDeletedPostForProfile() {
        const date = new Date();
        // console.log('PostForProfile: makeDeletedPostForProfile - this.deletedAt 😡 ', this.deletedAt)
        if (this.deletedAt !== null) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_POST)
        }
        // console.log('PostForProfile: makeDeletedPostForProfile - this.deletedAt 😡 PREV', this.deletedAt)
        this.deletedAt = date.toISOString();
        // console.log('PostForProfile: makeDeletedPostForProfile - this.deletedAt 😡 ', this.deletedAt)
    }
}
export const PostForProfileSchema = SchemaFactory.createForClass(PostForProfile);
//регистрирует методы сущности в схеме
PostForProfileSchema.loadClass(PostForProfile);
// Подключает виртуально CommentsSchema в PostForProfileSchema
PostForProfileSchema.virtual('comments', {
    ref: 'Comments',
    localField: '_id',
    foreignField: 'commentId',
});
//Типизация документа
export type PostForProfileDocument = HydratedDocument<PostForProfile>;
//Типизация модели + статические методы
export type PostForProfileModelType = Model<PostForProfileDocument> & typeof PostForProfile;