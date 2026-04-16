import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { CreateMyShopsDomainDto } from "../shops-dto/create-shops.domain-dto";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { UpdateMyShopsDomainDto } from "../shops-dto/update-shops-domain-dto";

@Schema({
    // timestamps: true,
    collection: 'my_shops',
    toJSON: { virtuals: true, versionKey: false }
})
export class MyShops {
    @ApiProperty({ example: 'name', description: 'Имя магазина' })
    @Prop({ type: String, required: true })
    name: string;

    @ApiProperty({ example: 'title', description: 'Описание типа магазина!' })
    @Prop({ type: String, nullable: true })
    title: string | null;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор владельца магазина' })
    @Prop({ type: String, required: true })
    userId: string;

    @ApiProperty({ example: 'shopTypeId', description: 'Уникальный идентификатор типа магазина!' })
    @Prop({ type: String, nullable: true })
    shopTypeId: string | null;

    @ApiProperty({ example: 'shopBrandId', description: 'Уникальный идентификатор магазина' })
    @Prop({ type: String, nullable: true })
    shopBrandId: string | null;

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

    static createMyShopsInstance(dto: Omit<CreateMyShopsDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): MyShopsDocument {
        const shop = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('TokenEntity: createTokenInstance - dto 😡 ', dto)

        shop.name = dto.name;
        shop.title = dto.title ? dto.title : null;
        shop.userId = dto.userId;
        shop.shopTypeId = dto.shopTypeId ? dto.shopTypeId : null;
        shop.shopBrandId = dto.shopBrandId ? dto.shopBrandId : null;

        shop.createdAt = createdAt;
        shop.updatedAt = createdAt;
        shop.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return shop as MyShopsDocument;
    }
    updateMyShops(dto: UpdateMyShopsDomainDto) {
        const date = new Date();
        const updatedAt = date.toISOString();

        if (this.id === dto.shopId) {
            this.name = dto.name ? dto.name : this.name;
            this.title = dto.title ? dto.title : this.title;
            this.shopTypeId = dto.shopTypeId ? dto.shopTypeId : this.shopTypeId;
            this.shopBrandId = dto.shopBrandId ? dto.shopBrandId : this.shopBrandId;
            this.userId = this.userId;
            this.createdAt = this.createdAt;
            this.updatedAt = updatedAt;
            this.deletedAt = this.deletedAt;
        }
    }
    makeDeletedMyShops() {
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
export const MyShopsSchema = SchemaFactory.createForClass(MyShops);
//регистрирует методы сущности в схеме
MyShopsSchema.loadClass(MyShops);
// Подключает виртуально PhotoSchema в PhotoSchema
MyShopsSchema.virtual('comments', {
    ref: 'Comments',
    localField: '_id',
    foreignField: 'postId',
});
//Типизация документа
export type MyShopsDocument = HydratedDocument<MyShops>;
//Типизация модели + статические методы
export type MyShopsModelType = Model<MyShopsDocument> & typeof MyShops;