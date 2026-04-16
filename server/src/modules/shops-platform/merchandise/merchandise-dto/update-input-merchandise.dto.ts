import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateMerchandiseInputDto {
    @ApiProperty({ example: 'merchandiseName', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'merchandiseName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseName не должно быть пустым!' })
    merchandiseName: string;

    @ApiProperty({ example: 'price', description: 'Уникальный идентификатор фото' })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 'rating', description: 'Уникальный идентификатор фото' })
    @IsNumber()
    rating: number;

    @ApiProperty({ example: 'quantity', description: 'Уникальный идентификатор фото' })
    @IsNumber()
    quantity: number;

    @ApiProperty({ example: 'info', description: 'Уникальный идентификатор фото' })
    @IsArray({ message: 'info должно быть массивом!' })
    @IsNotEmpty({ message: 'Поле info не должно быть пустым!' })
    info: [];

    @ApiProperty({ example: 'brandId', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'brandId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле brandId не должно быть пустым!' })
    brandId: string;

    @ApiProperty({ example: 'typeId', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'typeId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле typeId не должно быть пустым!' })
    typeId: string;

    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'shopId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopId не должно быть пустым!' })
    shopId: string;

    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsOptional({ message: 'Поле merchandiseImgName не должно быть пустым!' })
    @IsString({ message: 'merchandiseImgName должно быть строкой!' })
    merchandiseImgName: string;

    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsOptional({ message: 'Поле merchandiseCoverName не должно быть пустым!' })
    @IsString({ message: 'merchandiseCoverName должно быть строкой!' })
    merchandiseCoverName: string;
}