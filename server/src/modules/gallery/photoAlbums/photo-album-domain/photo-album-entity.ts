import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { UpdatePhotoAlbumDto } from "../photo-album-dto/update-photo-album-dto";
import { CreatePhotoAlbumDomainDto } from "../photo-album-dto/create-photo-album-domain-dto";

@Schema({
    // _id: false,
    // timestamps: true,
    collection: 'photo_album',
    toJSON: { virtuals: true, versionKey: false }
})
export class PhotoAlbum {
    @ApiProperty({ example: 'albumName', description: 'Имя альбома' })
    @Prop({ type: String, required: true })
    albumName: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя!' })
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

    static createPhotoAlbumInstance(dto: Omit<CreatePhotoAlbumDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): PhotoAlbumDocument {
        const photoAlbum = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('UserEntity: createInstance - user 😡 ', user)

        photoAlbum.userId = dto.userId;
        photoAlbum.albumName = dto.albumName;
        photoAlbum.createdAt = createdAt;
        photoAlbum.updatedAt = createdAt;
        photoAlbum.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return photoAlbum as PhotoAlbumDocument;
    }
    updatePhotoAlbum(dto: UpdatePhotoAlbumDto) {
        if (this.id === dto.id) {
            this.userId = dto.userId;
            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = null
        }
    }
}
export const PhotoAlbumSchema = SchemaFactory.createForClass(PhotoAlbum);
//регистрирует методы сущности в схеме
PhotoAlbumSchema.loadClass(PhotoAlbum);
// Подключает виртуально PhotoAlbumSchema в PhotoAlbumSchema
PhotoAlbumSchema.virtual('photo', {
    ref: 'PhotoAlbum',
    localField: '_id',
    foreignField: 'albumId',
});
//Типизация документа
export type PhotoAlbumDocument = HydratedDocument<PhotoAlbum>;
//Типизация модели + статические методы
export type PhotoAlbumModelType = Model<PhotoAlbumDocument> & typeof PhotoAlbum;