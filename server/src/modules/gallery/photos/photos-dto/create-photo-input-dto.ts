import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePhotoInputDto {
    // @ApiProperty({ example: 'albumId', description: 'Уникальный идентификатор альбома фото' })
    // @IsString({ message: 'albumId должно быть строкой!' })
    // @IsOptional()
    // readonly albumId?: string

    @ApiProperty({ example: 'albumName', description: 'Имя альбома' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    readonly albumName: string
}