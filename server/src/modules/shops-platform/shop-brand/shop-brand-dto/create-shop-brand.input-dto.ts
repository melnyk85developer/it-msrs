import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShopBrandInputDto {
    // @ApiProperty({ example: 'albumId', description: 'Уникальный идентификатор альбома фото' })
    // @IsString({ message: 'albumId должно быть строкой!' })
    // @IsOptional()
    // readonly albumId?: string

    @ApiProperty({ example: 'typeName', description: 'Имя альбома' })
    @IsString({ message: 'typeName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле typeName не должно быть пустым!' })
    readonly brandName: string
}