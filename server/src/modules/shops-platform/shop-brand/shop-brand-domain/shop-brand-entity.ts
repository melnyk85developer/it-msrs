import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { CreateShopBrandDomainDto } from "../shop-brand-dto/create-shop-brand.domain-dto";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { UpdateShopBrandDomainDto } from "../shop-brand-dto/update-shop-brand.domain.dto";

@Schema({
    // timestamps: true,
    collection: 'shop_brand',
    toJSON: { virtuals: true, versionKey: false }
})
export class ShopBrand {
    @ApiProperty({ example: 'Apple', description: 'Бренд магазина' })
    @Prop({ type: String, required: true })
    brandName: string;

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

    static createShopBrandInstance(dto: Omit<CreateShopBrandDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): ShopBrandDocument {
        const brand = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('TokenEntity: createTokenInstance - dto 😡 ', dto)

        brand.brandName = dto.brandName;
        brand.userId = dto.userId;

        brand.createdAt = createdAt;
        brand.updatedAt = createdAt;
        brand.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return brand as ShopBrandDocument;
    }
    updateShopBrand(dto: UpdateShopBrandDomainDto) {
        const date = new Date();
        const updatedAt = date.toISOString();

        if (this.id === dto.typeId) {
            this.brandName = dto.brandName ? dto.brandName : this.brandName;
            this.userId = this.userId;
            this.createdAt = this.createdAt;
            this.updatedAt = updatedAt;
            this.deletedAt = this.deletedAt;
        }
    }
    makeDeletedShopBrand() {
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
export const ShopBrandSchema = SchemaFactory.createForClass(ShopBrand);
//регистрирует методы сущности в схеме
ShopBrandSchema.loadClass(ShopBrand);
// Подключает виртуально PhotoSchema в PhotoSchema
ShopBrandSchema.virtual('comments', {
    ref: 'Comments',
    localField: '_id',
    foreignField: 'postId',
});
//Типизация документа
export type ShopBrandDocument = HydratedDocument<ShopBrand>;
//Типизация модели + статические методы
export type ShopTypeModelBrand = Model<ShopBrandDocument> & typeof ShopBrand;