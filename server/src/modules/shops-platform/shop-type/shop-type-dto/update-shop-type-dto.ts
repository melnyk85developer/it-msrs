import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdateShopTypeDto {
    @ApiProperty({ example: 'typeName', description: 'Имя типа магазина' })
    @IsString({ message: 'typeName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле typeName не должно быть пустым!' })
    typeName: string
}