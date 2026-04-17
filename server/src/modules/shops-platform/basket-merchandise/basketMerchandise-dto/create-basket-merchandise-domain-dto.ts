import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBasketMerchandiseDomainDto {
    // @ApiProperty({ example: 'basketMerchandiseId', description: 'Уникальный идентификатор товара в корзине' })
    // @IsString({ message: 'basketMerchandiseId должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле basketMerchandiseId не должно быть пустым!' })
    // readonly basketMerchandiseId: string

    @ApiProperty({ example: 'basketId', description: 'Уникальный идентификатор корзины' })
    @IsString({ message: 'basketId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле basketId не должно быть пустым!' })
    readonly basketId: string

    @ApiProperty({ example: 'merchandiseId', description: 'Уникальный идентификатор товара' })
    @IsString({ message: 'merchandiseId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseId не должно быть пустым!' })
    readonly merchandiseId: string

    @ApiProperty({ example: 'merchandiseName', description: 'Название товара' })
    @IsOptional()
    @IsString({ message: 'merchandiseName должно быть строкой!' })
    readonly merchandiseName: string

    @ApiProperty({ example: 'merchandiseImgName', description: 'Картинка товара' })
    @IsString({ message: 'merchandiseImgName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseImgName не должно быть пустым!' })
    readonly merchandiseImgName: string | null;

    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор магазина' })
    @IsString({ message: 'shopId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopId не должно быть пустым!' })
    readonly shopId: string

    @ApiProperty({ example: 'price', description: 'Стоимость товара' })
    @IsString({ message: 'price должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле price не должно быть пустым!' })
    readonly price: string

    @ApiProperty({ example: 'quantity', description: 'Колличество товаров в заказе!' })
    @IsString({ message: 'quantity должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле quantity не должно быть пустым!' })
    readonly quantity: string

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}