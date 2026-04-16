import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateMyShopsDomainDto {
    @ApiProperty({ example: 'name', description: 'Имя магазина' })
    @IsString({ message: 'name должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле name не должно быть пустым!' })
    readonly name: string

    @ApiProperty({ example: 'Компьютерная техника', description: 'Название подзаголовка' })
    @IsOptional()
    @IsString({ message: 'Title должно быть строкой!' })
    readonly title?: string;

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

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}