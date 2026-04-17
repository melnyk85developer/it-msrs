import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdateShopBrandDomainDto {
    @ApiProperty({ example: 'brandName', description: 'Имя альбома' })
    @IsString({ message: 'typeName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле typeName не должно быть пустым!' })
    brandName: string

    @ApiProperty({ example: 'albumId', description: 'Уникальный идентификатор альбома фото' })
    @IsString({ message: 'albumId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumId не должно быть пустым!' })
    readonly typeId: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор хозяина фото' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    readonly userId: string
}