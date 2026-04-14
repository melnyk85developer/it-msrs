import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { CreateShopTypeDomainDto } from "../shop-type-dto/create-shop-type.domain-dto";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { UpdateShopTypeDomainDto } from "../shop-type-dto/update-shop-type.domain.dto";

@Schema({
    // timestamps: true,
    collection: 'shop_type',
    toJSON: { virtuals: true, versionKey: false }
})
export class ShopType {
    @ApiProperty({ example: 'Продукты', description: 'Тип магазина' })
    @Prop({ type: String, required: true })
    typeName: string;

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

    static createShopTypeInstance(dto: Omit<CreateShopTypeDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): ShopTypeDocument {
        const type = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('TokenEntity: createTokenInstance - dto 😡 ', dto)

        type.typeName = dto.typeName;

        type.createdAt = createdAt;
        type.updatedAt = createdAt;
        type.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return type as ShopTypeDocument;
    }
    updateShopType(dto: UpdateShopTypeDomainDto) {
        const date = new Date();
        const updatedAt = date.toISOString();

        if (this.id === dto.typeId) {
            this.typeName = dto.typeName ? dto.typeName : this.typeName;
            this.userId = this.userId;
            this.createdAt = this.createdAt;
            this.updatedAt = updatedAt;
            this.deletedAt = this.deletedAt;
        }
    }
    makeDeletedShopType() {
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
export const ShopTypeSchema = SchemaFactory.createForClass(ShopType);
//регистрирует методы сущности в схеме
ShopTypeSchema.loadClass(ShopType);
// Подключает виртуально PhotoSchema в PhotoSchema
ShopTypeSchema.virtual('comments', {
    ref: 'Comments',
    localField: '_id',
    foreignField: 'postId',
});
//Типизация документа
export type ShopTypeDocument = HydratedDocument<ShopType>;
//Типизация модели + статические методы
export type ShopTypeModelType = Model<ShopTypeDocument> & typeof ShopType;