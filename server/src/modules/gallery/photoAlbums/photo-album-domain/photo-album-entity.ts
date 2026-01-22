import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { UpdatePhotoAlbumDto } from "../photo-album-dto/update-photo-album-dto";
import { CreatePhotoAlbumDomainDto } from "../photo-album-dto/create-photo-album-domain-dto";
import { UpdatePhotoAlbumDomainDto } from "../photo-album-dto/update-photo-album-domain-dto";

@Schema({
    // _id: false,
    // timestamps: true,
    collection: 'photo_album',
    toJSON: { virtuals: true, versionKey: false }
})
export class PhotoAlbum {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя!' })
    @Prop({ type: String, required: true })
    userId: string;

    @ApiProperty({ example: 'albumName', description: 'Имя альбома' })
    @Prop({ type: String, required: true })
    albumName: string;

    @ApiProperty({ example: 'albumCoverName.jpg', description: 'Имя файла миниатюры' })
    @Prop({ type: String, required: true, nullable: true })
    albumCoverName: string | null;

    @ApiProperty({ example: 'createdAt', description: 'Число создания аккаунта.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления аккаунта.' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления  аккаунта.' })
    @Prop({ type: String, nullable: false })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createPhotoAlbumInstance(dto: Omit<CreatePhotoAlbumDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): PhotoAlbumDocument {
        const photoAlbum = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('PhotoAlbumEntity: createInstance - user 😡 ', user)

        photoAlbum.userId = dto.userId;
        photoAlbum.albumName = dto.albumName;
        photoAlbum.albumCoverName = dto.albumCoverName ? dto.albumCoverName : null;
        photoAlbum.createdAt = createdAt;
        photoAlbum.updatedAt = createdAt;
        photoAlbum.deletedAt = null;

        // console.log('PhotoAlbumEntity: createInstance - token 😡 ', token)
        return photoAlbum as PhotoAlbumDocument;
    } 
    updatePhotoAlbum(dto: Omit<UpdatePhotoAlbumDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        if (this.id === dto.albumId) {
            this.userId = this.userId;
            this.albumName = dto.albumName ? dto.albumName : this.albumName;
            this.albumCoverName = dto.albumCoverName ? dto.albumCoverName : this.albumCoverName
            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt
        }
    }
    makeDeletedPhotoAlbum() {
        const date = new Date();
        // console.log('PhotoAlbumEntity: makeDeletedPhotoAlbum - this.deletedAt 😡 ', this.accountData.deletedAt)
        if (this.deletedAt !== null) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO)
        }
        // console.log('PhotoAlbumEntity: makeDeletedPhotoAlbum - this.deletedAt 😡 PREV', this.accountData.deletedAt)
        this.deletedAt = date.toISOString();
        // console.log('PhotoAlbumEntity: makeDeletedPhotoAlbum - this.deletedAt 😡 ', this.accountData.deletedAt)
    }
}
export const PhotoAlbumSchema = SchemaFactory.createForClass(PhotoAlbum);
//регистрирует методы сущности в схеме
PhotoAlbumSchema.loadClass(PhotoAlbum);
// Подключает виртуально PhotoAlbumSchema в PhotoAlbumSchema
// PhotoAlbumSchema.virtual('photo', {
//     ref: 'PhotoAlbum',
//     localField: '_id',
//     foreignField: 'albumId',
// });
//Типизация документа
export type PhotoAlbumDocument = HydratedDocument<PhotoAlbum>;
//Типизация модели + статические методы
export type PhotoAlbumModelType = Model<PhotoAlbumDocument> & typeof PhotoAlbum;