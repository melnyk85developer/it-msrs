import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreateBasketDomainDto } from "../basket-dto/create-basket-domain-dto";

@Schema({
    // _id: false,
    // timestamps: true,
    collection: 'basket',
    toJSON: { virtuals: true, versionKey: false }
})
export class Basket {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя!' })
    @Prop({ type: String, required: true })
    userId: string;

    // @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор магазина' })
    // @Prop({ type: String, required: true })
    // shopId: string;

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

    static createBasketInstance(dto: Omit<CreateBasketDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): BasketDocument {
        const basket = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('PhotoAlbumEntity: createInstance - user 😡 ', user)

        basket.userId = dto.userId;
        // basket.shopId = dto.shopId;
        basket.createdAt = createdAt;
        basket.updatedAt = createdAt;
        basket.deletedAt = null;

        // console.log('PhotoAlbumEntity: createInstance - token 😡 ', token)
        return basket as BasketDocument;
    } 
    makeDeletedBasket() {
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
export const BasketSchema = SchemaFactory.createForClass(Basket);
//регистрирует методы сущности в схеме
BasketSchema.loadClass(Basket);
// Подключает виртуально PhotoAlbumSchema в PhotoAlbumSchema
// PhotoAlbumSchema.virtual('photo', {
//     ref: 'PhotoAlbum',
//     localField: '_id',
//     foreignField: 'albumId',
// });
//Типизация документа
export type BasketDocument = HydratedDocument<Basket>;
//Типизация модели + статические методы
export type BasketModelType = Model<BasketDocument> & typeof Basket;