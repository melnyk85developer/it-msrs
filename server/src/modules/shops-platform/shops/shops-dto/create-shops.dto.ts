import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateMyShopsDto {
    @ApiProperty({ example: 'Визит', description: 'Название магазина' })
    @IsString({ message: 'name должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле name не должно быть пустым!' })
    readonly name: string;

    @ApiProperty({ example: 'Компьютерная техника', description: 'Название подзаголовка' })
    @IsOptional()
    @IsString({ message: 'Title должно быть строкой!' })
    readonly title?: string;

    @ApiProperty({ example: 'Компьютерная техника', description: 'Название подзаголовка' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    readonly userId: string;

    @ApiProperty({ example: 'shopTypeId', description: 'Уникальный идентификатор типа магазина' })
    @IsOptional()
    @IsString({ message: 'shopTypeId должно быть строкой!' })
    readonly shopTypeId?: string
    @ApiProperty({ example: 'shopBrandId', description: 'Уникальный идентификатор типа магазина' })
    @IsOptional()
    @IsString({ message: 'shopBrandId должно быть строкой!' })
    readonly shopBrandId?: string
}