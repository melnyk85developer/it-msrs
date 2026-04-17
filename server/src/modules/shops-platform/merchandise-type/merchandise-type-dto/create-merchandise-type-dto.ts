import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMerchandiseTypeDto {
    // @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    // @IsString({ message: 'login должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    // readonly userId: string

    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор магазина' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopId не должно быть пустым!' })
    readonly shopId: string

    @ApiProperty({ example: 'Продукты', description: 'Тип товара' })
    @IsString({ message: 'merchandiseTypeName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseTypeName не должно быть пустым!' })
    readonly merchandiseTypeName: string;
}