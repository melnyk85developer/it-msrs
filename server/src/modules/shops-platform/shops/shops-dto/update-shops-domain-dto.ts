import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateMyShopsDomainDto {
    @ApiProperty({ example: 'shopId', description: 'Имя магазина' })
    @IsString({ message: 'shopId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopId не должно быть пустым!' })
    readonly shopId: string

    @ApiProperty({ example: 'name', description: 'Имя магазина' })
    @IsString({ message: 'name должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле name не должно быть пустым!' })
    readonly name: string

    @ApiProperty({ example: 'title', description: 'Заголовок типа магазина' })
    @IsString({ message: 'title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле title не должно быть пустым!' })
    readonly title: string

    @ApiProperty({ example: 'shopTypeId', description: 'Уникальный идентификатор типа магазина' })
    @IsOptional()
    @IsString({ message: 'shopTypeId должно быть строкой!' })
    readonly shopTypeId?: string
    @ApiProperty({ example: 'shopBrandId', description: 'Уникальный идентификатор типа магазина' })
    @IsOptional()
    @IsString({ message: 'shopBrandId должно быть строкой!' })
    readonly shopBrandId?: string

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор хозяина фото' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    readonly userId: string
}