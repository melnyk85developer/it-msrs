import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreatePhotoDomainDto {
    @ApiProperty({ example: 'image.jpg', description: 'Имя файла картинки' })
    @IsString({ message: 'image должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле image не должно быть пустым!' })
    readonly image: string

    @ApiProperty({ example: 'image.jpg', description: 'Имя файла миниатюры' })
    @IsString({ message: 'miniature должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле miniature не должно быть пустым!' })
    readonly miniature: string

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

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}