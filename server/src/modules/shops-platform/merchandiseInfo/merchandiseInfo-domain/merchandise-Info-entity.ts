import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreateMerchandiseInfoDomainDto } from "../merchandise-Info-dto/create-merchandise-Info.domain.dto";
import { UpdateMerchandiseInfoDomainDto } from "../merchandise-Info-dto/update-merchandise-Info.domain.dto";

@Schema({
    // _id: false,
    // timestamps: true,
    collection: 'merchandise_info',
    toJSON: { virtuals: true, versionKey: false }
})
export class MerchandiseInfo {
    @ApiProperty({ example: 'title', description: 'Заголовок информации о товаре' })
    @Prop({ type: String, required: true })
    title: string;

    @ApiProperty({ example: 'description', description: 'Описание информации о товаре' })
    @Prop({ type: String, nullable: true })
    description: string | null;

    @ApiProperty({ example: 'albumName', description: 'Имя альбома' })
    @Prop({ type: String, required: true })
    merchandiseId: string;

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

    static createMerchandiseInfoInstance(dto: Omit<CreateMerchandiseInfoDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): MerchandiseInfoDocument {
        const info = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('PhotoAlbumEntity: createInstance - user 😡 ', user)

        info.title = dto.title;
        info.description = dto.description;
        info.merchandiseId = dto.merchandiseId;
        info.createdAt = createdAt;
        info.updatedAt = createdAt;
        info.deletedAt = null;

        // console.log('PhotoAlbumEntity: createInstance - token 😡 ', token)
        return info as MerchandiseInfoDocument;
    }
    updateMerchandiseInfo(dto: Omit<UpdateMerchandiseInfoDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        if (this.id === dto.infoId) {
            this.title = dto.title ? dto.title : this.title;
            this.description = dto.description ? dto.description : this.description
            this.merchandiseId = this.merchandiseId;
            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt
        }
    }
    makeDeletedMerchandiseInfo() {
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
export const MerchandiseInfoSchema = SchemaFactory.createForClass(MerchandiseInfo);
//регистрирует методы сущности в схеме
MerchandiseInfoSchema.loadClass(MerchandiseInfo);
// Подключает виртуально PhotoAlbumSchema в PhotoAlbumSchema
// PhotoAlbumSchema.virtual('photo', {
//     ref: 'PhotoAlbum',
//     localField: '_id',
//     foreignField: 'albumId',
// });
//Типизация документа
export type MerchandiseInfoDocument = HydratedDocument<MerchandiseInfo>;
//Типизация модели + статические методы
export type MerchandiseInfoModelType = Model<MerchandiseInfoDocument> & typeof MerchandiseInfo;