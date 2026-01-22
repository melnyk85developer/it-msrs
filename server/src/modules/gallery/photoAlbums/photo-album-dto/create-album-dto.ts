import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAlbumDto {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    readonly userId: string

    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    readonly albumName: string;
}