import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Multer } from 'multer';
import { Trim } from "src/core/decorators/transform/trim";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateBasketMerchandiseInputDto {
    @ApiProperty({ example: 'basketMerchandiseId', description: 'Уникальный идентификатор товара в корзине' })
    @IsString({ message: 'basketMerchandiseId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле basketMerchandiseId не должно быть пустым!' })
    readonly basketMerchandiseId: string

    @ApiProperty({ example: 'basketId', description: 'Уникальный идентификатор корзины' })
    @IsString({ message: 'basketId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле basketId не должно быть пустым!' })
    readonly basketId: string

    @ApiProperty({ example: 'merchandiseId', description: 'Уникальный идентификатор товара' })
    @IsString({ message: 'merchandiseId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseId не должно быть пустым!' })
    readonly merchandiseId: string

    @ApiProperty({ example: 'merchandiseName', description: 'Название товара' })
    @IsString({ message: 'merchandiseName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseName не должно быть пустым!' })
    readonly merchandiseName: string

    @ApiProperty({ example: 'image', description: 'Картинка товара' })
    @IsString({ message: 'image должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле image не должно быть пустым!' })
    readonly merchandiseImgName: string

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
}