import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreateMerchandiseTypeDomainDto } from "../merchandise-type-dto/create-merchandise-type.domain-dto";
import { UpdateMerchandiseTypeDomainDto } from "../merchandise-type-dto/update-merchandise-type.domain.dto";

@Schema({
    // _id: false,
    // timestamps: true,
    collection: 'merchandise_type',
    toJSON: { virtuals: true, versionKey: false }
})
export class MerchandiseType {
    @ApiProperty({ example: 'merchandiseTypeName', description: 'Имя типа товара' })
    @Prop({ type: String, required: true })
    merchandiseTypeName: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя!' })
    @Prop({ type: String, required: false })
    userId: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор магазина!' })
    @Prop({ type: String, required: false })
    shopId: string;

    @ApiProperty({ example: 'createdAt', description: 'Число создания записи.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления записи.' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления  записи.' })
    @Prop({ type: String, nullable: false })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createMerchandiseTypeInstance(dto: Omit<CreateMerchandiseTypeDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): MerchandiseTypeDocument {
        const merchandiseType = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('PhotoAlbumEntity: createInstance - user 😡 ', user)

        merchandiseType.merchandiseTypeName = dto.merchandiseTypeName;
        merchandiseType.userId = dto.userId;
        merchandiseType.shopId = dto.shopId;
        merchandiseType.createdAt = createdAt;
        merchandiseType.updatedAt = createdAt;
        merchandiseType.deletedAt = null;

        // console.log('PhotoAlbumEntity: createInstance - token 😡 ', token)
        return merchandiseType as MerchandiseTypeDocument;
    }
    updateMerchandiseType(dto: Omit<UpdateMerchandiseTypeDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        if (this.id === dto.typeId) {
            this.shopId = this.shopId;
            this.merchandiseTypeName = dto.merchandiseTypeName ? dto.merchandiseTypeName : this.merchandiseTypeName;
            this.userId = this.userId;
            this.shopId = this.shopId;
            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt
        }
    }
    makeDeletedMerchandiseType() {
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
export const MerchandiseTypeSchema = SchemaFactory.createForClass(MerchandiseType);
//регистрирует методы сущности в схеме
MerchandiseTypeSchema.loadClass(MerchandiseType);
// Подключает виртуально PhotoAlbumSchema в PhotoAlbumSchema
// PhotoAlbumSchema.virtual('photo', {
//     ref: 'PhotoAlbum',
//     localField: '_id',
//     foreignField: 'albumId',
// });
//Типизация документа
export type MerchandiseTypeDocument = HydratedDocument<MerchandiseType>;
//Типизация модели + статические методы
export type MerchandiseTypeModelType = Model<MerchandiseTypeDocument> & typeof MerchandiseType;