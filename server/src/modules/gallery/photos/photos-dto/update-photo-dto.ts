import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdatePhotoDto {
    @ApiProperty({ example: 'photoId', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'photoId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле photoId не должно быть пустым!' })
    readonly photoId: string;

    @ApiProperty({ example: 'albumId', description: 'Уникальный идентификатор альбома фото' })
    @IsString({ message: 'albumId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumId не должно быть пустым!' })
    readonly albumId: string

    @ApiProperty({ example: 'albumName', description: 'Имя альбома' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    readonly albumName: string

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор хозяина фото' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    readonly userId: string
}