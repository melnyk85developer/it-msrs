import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateMyShopsDomainDto {
    @ApiProperty({ example: 'name', description: 'Имя магазина' })
    @IsString({ message: 'name должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле name не должно быть пустым!' })
    readonly name: string

    @ApiProperty({ example: 'title', description: 'Заголовок типа магазина' })
    @IsString({ message: 'title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле title не должно быть пустым!' })
    readonly title: string

    @ApiProperty({ example: 'shopTypeId', description: 'Уникальный идентификатор типа магазина' })
    @IsString({ message: 'shopTypeId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopTypeId не должно быть пустым!' })
    readonly shopTypeId: string

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор хозяина фото' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    readonly userId: string

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}