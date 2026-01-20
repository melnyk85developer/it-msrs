import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreatePhotoDto {
    @ApiProperty({ example: 'albumId', description: 'Уникальный идентификатор альбома фото' })
    @IsString({ message: 'albumId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumId не должно быть пустым!' })
    readonly albumId?: string;

    @ApiProperty({ example: 'albumName', description: 'Имя альбома' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    readonly albumName: string;
}