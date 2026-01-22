import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdatePhotoAlbumInputDto {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    userId: string

    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    albumName: string;

    @ApiProperty({ example: 'albumCover', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'albumCover должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле miniature не должно быть пустым!' })
    albumCoverName: string;
}