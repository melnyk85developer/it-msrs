import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreateBasketMerchandiseDomainDto } from "../basketMerchandise-dto/create-basket-merchandise-domain-dto";
import { UpdateBasketMerchandiseDomainDto } from "../basketMerchandise-dto/update-basket-merchandise-domain-dto";

@Schema({
    // _id: false,
    // timestamps: true,
    collection: 'basket-merchandise',
    toJSON: { virtuals: true, versionKey: false }
})
export class BasketMerchandise {
    @ApiProperty({ example: 'basketId', description: 'Уникальный идентификатор корзины' })
    @Prop({ type: String, required: true })
    basketId: string;

    @ApiProperty({ example: 'merchandiseId', description: 'Уникальный идентификатор товара' })
    @Prop({ type: String, required: true })
    merchandiseId: string;

    @ApiProperty({ example: 'merchandiseName', description: 'Название товара' })
    @Prop({ type: String, required: true })
    merchandiseName: string;

    @ApiProperty({ example: 'merchandiseImgName', description: 'Картинка товара' })
    @Prop({ type: String, nullable: false })
    merchandiseImgName: string | null;

    @ApiProperty({ example: 'merchandiseCoverName.jpg', description: 'Имя файла миниатюры' })
    @Prop({ type: String, nullable: true })
    merchandiseCoverName: string | null;

    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор магазина' })
    @Prop({ type: String, nullable: true })
    shopId: string;

    @ApiProperty({ example: 'price', description: 'Стоимость товара' })
    @Prop({ type: String, required: true })
    price: string;

    @ApiProperty({ example: 'quantity', description: 'Колличество товаров в заказе!' })
    @Prop({ type: String, required: true })
    quantity: string;

    @ApiProperty({ example: 'createdAt', description: 'Число добавления товара в корзину' })
    @Prop({ type: String, required: false })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления товара в корзинне' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления товара из корзинны' })
    @Prop({ type: String, nullable: false })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createBasketMerchandiseInstance(dto: Omit<CreateBasketMerchandiseDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): BasketMerchandiseDocument {
        const basketMerchandise = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('PhotoAlbumEntity: createInstance - user 😡 ', user)
        basketMerchandise.basketId = dto.basketId;
        basketMerchandise.merchandiseId = dto.merchandiseId;
        basketMerchandise.merchandiseName = dto.merchandiseName;
        basketMerchandise.merchandiseImgName = dto.merchandiseImgName;
        basketMerchandise.shopId = dto.shopId;
        basketMerchandise.price = dto.price;
        basketMerchandise.quantity = dto.quantity;
        basketMerchandise.createdAt = createdAt;
        basketMerchandise.updatedAt = createdAt;
        basketMerchandise.deletedAt = null;

        // console.log('PhotoAlbumEntity: createInstance - token 😡 ', token)
        return basketMerchandise as BasketMerchandiseDocument;
    }
    updateBasketMerchandise(dto: Omit<UpdateBasketMerchandiseDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        if (this.id === dto.basketMerchandiseId) {
            this.basketId = this.basketId;
            this.merchandiseId = this.merchandiseId;
            this.shopId = this.shopId;
            this.price = this.price;

            this.merchandiseName = dto.merchandiseName ? dto.merchandiseName : this.merchandiseName;
            this.merchandiseImgName = dto.merchandiseImgName ? dto.merchandiseImgName : this.merchandiseImgName;
            this.quantity = dto.quantity ? dto.quantity : this.quantity

            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt
        }
    }
    makeDeletedBasketMerchandise() {
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
export const BasketMerchandiseSchema = SchemaFactory.createForClass(BasketMerchandise);
//регистрирует методы сущности в схеме
BasketMerchandiseSchema.loadClass(BasketMerchandise);
// Подключает виртуально PhotoAlbumSchema в PhotoAlbumSchema
// PhotoAlbumSchema.virtual('photo', {
//     ref: 'PhotoAlbum',
//     localField: '_id',
//     foreignField: 'albumId',
// });
//Типизация документа
export type BasketMerchandiseDocument = HydratedDocument<BasketMerchandise>;
//Типизация модели + статические методы
export type BasketMerchandiseModelType = Model<BasketMerchandiseDocument> & typeof BasketMerchandise;