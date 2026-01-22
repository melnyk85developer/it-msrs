import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { UpdatePhotoDto } from "../photos-dto/update-photo-dto";
import { CreatePhotoDomainDto } from "../photos-dto/create-photo-domain-dto";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { UpdatePhotoDomainDto } from "../photos-dto/update-domain-photo-dto";

@Schema({
    // timestamps: true,
    collection: 'photo',
    toJSON: { virtuals: true, versionKey: false }
})
export class Photo {
    @ApiProperty({ example: 'image.jpg', description: 'Имя файла фото' })
    @Prop({ type: String, required: true })
    image: string;

    @ApiProperty({ example: 'image.jpg', description: 'Имя файла миниатюры' })
    @Prop({ type: String, required: true })
    miniature: string;

    @ApiProperty({ example: 'albumId', description: 'Уникальный идентификатор владельца фотографии!' })
    @Prop({ type: String, required: true })
    albumId: string;

    @ApiProperty({ example: 'albumName', description: 'Имя альбома' })
    @Prop({ type: String, required: true })
    albumName: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор владельца фотографии!' })
    @Prop({ type: String, required: true })
    userId: string;

    @ApiProperty({ example: 'createdAt', description: 'Число создания аккаунта.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления аккаунта.' })
    @Prop({ type: String, required: true })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления  аккаунта.' })
    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createPhotoInstance(dto: Omit<CreatePhotoDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): PhotoDocument {
        const photo = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('TokenEntity: createTokenInstance - dto 😡 ', dto)

        photo.image = dto.image;
        photo.miniature = dto.miniature;
        photo.albumId = dto.albumId;
        photo.albumName = dto.albumName;
        photo.userId = dto.userId;

        photo.createdAt = createdAt;
        photo.updatedAt = createdAt;
        photo.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return photo as PhotoDocument;
    }
    updatePhoto(dto: UpdatePhotoDomainDto) {
        const date = new Date();
        const updatedAt = date.toISOString();

        if (this.id === dto.photoId) {
            this.image = dto.image ? dto.image : this.image;
            this.miniature = dto.miniature ? dto.miniature : this.miniature;
            this.albumId = dto.albumId ? dto.albumId : this.albumId;
            this.albumName = dto.albumName ? dto.albumName : this.albumName;
            this.userId = this.userId;
            this.createdAt = this.createdAt;
            this.updatedAt = updatedAt;
            this.deletedAt = this.deletedAt;
        }
    }
    makeDeletedPhoto() {
        const date = new Date();
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.accountData.deletedAt)
        if (this.deletedAt !== null) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO)
        }
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 PREV', this.accountData.deletedAt)
        this.deletedAt = date.toISOString();
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.accountData.deletedAt)
    }
}
export const PhotoSchema = SchemaFactory.createForClass(Photo);
//регистрирует методы сущности в схеме
PhotoSchema.loadClass(Photo);
// Подключает виртуально PhotoSchema в PhotoSchema
PhotoSchema.virtual('comments', {
    ref: 'Comments',
    localField: '_id',
    foreignField: 'postId',
});
//Типизация документа
export type PhotoDocument = HydratedDocument<Photo>;
//Типизация модели + статические методы
export type PhotoModelType = Model<PhotoDocument> & typeof Photo;