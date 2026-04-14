import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMerchandiseDomainDto {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    userId: string

    @ApiProperty({ example: 'merchandiseName', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'merchandiseName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseName не должно быть пустым!' })
    merchandiseName: string;

    @ApiProperty({ example: 'price', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'price должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле price не должно быть пустым!' })
    price: string;

    @ApiProperty({ example: 'price', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'price должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле price не должно быть пустым!' })
    info: string;

    @ApiProperty({ example: 'rating', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'rating должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле price не должно быть пустым!' })
    rating: string;

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
    @IsString({ message: 'merchandiseImgName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseImgName не должно быть пустым!' })
    merchandiseImgName: string;

    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'merchandiseCoverName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseCoverName не должно быть пустым!' })
    merchandiseCoverName: string;

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}