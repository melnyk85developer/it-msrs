import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreateMerchandiseDomainDto } from "../merchandise-dto/create-merchandise-domain.dto";
import { UpdateMerchandiseDomainDto } from "../merchandise-dto/update-merchandise-domain.dto";

@Schema({
    // _id: false,
    // timestamps: true,
    collection: 'merchandise',
    toJSON: { virtuals: true, versionKey: false }
})
export class Merchandise {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя!' })
    @Prop({ type: String, required: true })
    userId: string;

    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор магазина!' })
    @Prop({ type: String, required: true })
    shopId: string;

    @ApiProperty({ example: 'typeId', description: 'Уникальный идентификатор магазина!' })
    @Prop({ type: String, required: true })
    typeId: string;

    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор магазина!' })
    @Prop({ type: String, required: true })
    brandId: string;

    @ApiProperty({ example: 'Компьютер', description: 'Название устройства' })
    @Prop({ type: String, required: true })
    merchandiseName: string;

    @ApiProperty({ example: '1000', description: 'Цена устройства' })
    @Prop({ type: Number, required: true })
    price: number;

    @ApiProperty({ example: 'quantity', description: 'Колличество!' })
    @Prop({ type: Number, required: true })
    quantity: number;

    @ApiProperty({ example: '5', description: 'Рейтинг устройства' })
    @Prop({ type: Number, required: true })
    rating: number;

    @ApiProperty({ example: 'image.jpg', description: 'Имя файла изображения устройства' })
    @Prop({ type: String, nullable: true })
    merchandiseImgName: string | null;

    @ApiProperty({ example: 'merchandiseCoverName.jpg', description: 'Имя файла миниатюры' })
    @Prop({ type: String, nullable: true })
    merchandiseCoverName: string | null;

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

    static createMerchandiseInstance(dto: Omit<CreateMerchandiseDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): MerchandiseDocument {
        const merchandise = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('PhotoAlbumEntity: createInstance - user 😡 ', user)

        merchandise.userId = dto.userId;
        merchandise.merchandiseName = dto.merchandiseName;
        merchandise.brandId = dto.brandId;
        merchandise.typeId = dto.typeId;
        merchandise.shopId = dto.shopId;
        merchandise.price = dto.price;
        merchandise.rating = dto.rating;
        merchandise.quantity = dto.quantity;
        // merchandise.info = dto.info
        merchandise.merchandiseImgName = dto.merchandiseImgName ? dto.merchandiseImgName : null;
        merchandise.merchandiseCoverName = dto.merchandiseCoverName ? dto.merchandiseCoverName : null;
        merchandise.createdAt = createdAt;
        merchandise.updatedAt = createdAt;
        merchandise.deletedAt = null;

        // console.log('PhotoAlbumEntity: createInstance - token 😡 ', token)
        return merchandise as MerchandiseDocument;
    }
    updateMerchandise(dto: Omit<UpdateMerchandiseDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        if (this.id === dto.merchandiseId) {
            this.userId = this.userId;
            this.brandId = dto.brandId;
            this.typeId = dto.typeId;
            this.shopId = dto.shopId;
            this.price = dto.price;
            this.rating = dto.rating;
            this.quantity = dto.quantity;
            this.merchandiseName = dto.merchandiseName ? dto.merchandiseName : this.merchandiseName
            this.merchandiseImgName = dto.merchandiseImgName ? dto.merchandiseImgName : this.merchandiseImgName;
            this.merchandiseCoverName = dto.merchandiseCoverName ? dto.merchandiseCoverName : this.merchandiseCoverName;
            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt
        }
    }
    makeDeletedMerchandise() {
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
export const MerchandiseSchema = SchemaFactory.createForClass(Merchandise);
//регистрирует методы сущности в схеме
MerchandiseSchema.loadClass(Merchandise);
// Подключает виртуально PhotoAlbumSchema в PhotoAlbumSchema
// PhotoAlbumSchema.virtual('photo', {
//     ref: 'PhotoAlbum',
//     localField: '_id',
//     foreignField: 'albumId',
// });
//Типизация документа
export type MerchandiseDocument = HydratedDocument<Merchandise>;
//Типизация модели + статические методы
export type MerchandiseModelType = Model<MerchandiseDocument> & typeof Merchandise;