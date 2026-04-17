import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateMerchandiseTypeDto {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    readonly typeId: string

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор магазина' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsOptional()
    readonly userId?: string

    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор магазина' })
    @IsOptional()
    @IsString({ message: 'login должно быть строкой!' })
    readonly shopId?: string

    @ApiProperty({ example: 'Продукты', description: 'Тип товара' })
    @IsString({ message: 'merchandiseTypeName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseTypeName не должно быть пустым!' })
    merchandiseTypeName: string;
}