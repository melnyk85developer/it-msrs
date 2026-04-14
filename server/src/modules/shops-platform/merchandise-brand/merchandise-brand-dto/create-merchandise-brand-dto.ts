import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMerchandiseBrandDto {
    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'shopId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopId не должно быть пустым!' })
    readonly shopId: string

    @ApiProperty({ example: 'Apple', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'merchandiseBrandName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseBrandName не должно быть пустым!' })
    readonly merchandiseBrandName: string;
}