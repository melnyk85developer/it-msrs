import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { UpdateMerchandiseBrandDto } from "../merchandise-brand-dto/update-merchandise-brand.dto";
import { CreateMerchandiseBrandDomainDto } from "../merchandise-brand-dto/create-merchandise-brand-domain-dto";
import { UpdateMerchandiseBrandDomainDto } from "../merchandise-brand-dto/update-merchandise-brand.domain-dto";

@Schema({
    // _id: false,
    // timestamps: true,
    collection: 'merchandise_brand',
    toJSON: { virtuals: true, versionKey: false }
})
export class MerchandiseBrand {
    @ApiProperty({ example: 'merchandiseBrandName', description: 'Имя альбома' })
    @Prop({ type: String, required: true })
    merchandiseBrandName: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя!' })
    @Prop({ type: String, nullable: false })
    shopId: string | null;;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя!' })
    @Prop({ type: String, nullable: false })
    userId: string | null;;

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

    static createMerchandiseBrandInstance(dto: Omit<CreateMerchandiseBrandDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): MerchandiseBrandDocument {
        const brand = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('PhotoAlbumEntity: createInstance - user 😡 ', user)

        brand.shopId = dto.shopId ? dto.shopId : null;
        brand.userId = dto.userId ? dto.userId : null;
        brand.merchandiseBrandName = dto.merchandiseBrandName;
        brand.createdAt = createdAt;
        brand.updatedAt = createdAt;
        brand.deletedAt = null;

        // console.log('PhotoAlbumEntity: createInstance - token 😡 ', token)
        return brand as MerchandiseBrandDocument;
    }
    updateMerchandiseBrand(dto: Omit<UpdateMerchandiseBrandDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        if (this.id === dto.brandId) {
            this.shopId = this.shopId;
            this.userId = this.userId;
            this.merchandiseBrandName = dto.merchandiseBrandName;
            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt
        }
    }
    makeDeletedMerchandiseBrand() {
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
export const MerchandiseBrandSchema = SchemaFactory.createForClass(MerchandiseBrand);
//регистрирует методы сущности в схеме
MerchandiseBrandSchema.loadClass(MerchandiseBrand);
// Подключает виртуально PhotoAlbumSchema в PhotoAlbumSchema
// PhotoAlbumSchema.virtual('photo', {
//     ref: 'PhotoAlbum',
//     localField: '_id',
//     foreignField: 'albumId',
// });
//Типизация документа
export type MerchandiseBrandDocument = HydratedDocument<MerchandiseBrand>;
//Типизация модели + статические методы
export type MerchandiseBrandModelType = Model<MerchandiseBrandDocument> & typeof MerchandiseBrand;