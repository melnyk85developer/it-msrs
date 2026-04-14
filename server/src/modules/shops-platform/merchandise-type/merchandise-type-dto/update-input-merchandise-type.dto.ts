import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdateMerchandiseTypeInputDto {
    @ApiProperty({ example: 'Продукты', description: 'Тип товара' })
    @IsString({ message: 'merchandiseTypeName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseTypeName не должно быть пустым!' })
    merchandiseTypeName: string;
}