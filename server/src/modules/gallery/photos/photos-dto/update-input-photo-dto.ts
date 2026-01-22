import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdatePhotoInputDto {
    @ApiProperty({ example: 'image', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'image должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле image не должно быть пустым!' })
    imageName: string;
    @ApiProperty({ example: 'miniature', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'miniature должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле miniature не должно быть пустым!' })
    miniatureName: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    userId: string;

    @ApiProperty({ example: 'albumId', description: 'Уникальный идентификатор альбома фото' })
    @IsString({ message: 'albumId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumId не должно быть пустым!' })
    albumId: string

    @ApiProperty({ example: 'albumName', description: 'Имя альбома' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    albumName: string
}