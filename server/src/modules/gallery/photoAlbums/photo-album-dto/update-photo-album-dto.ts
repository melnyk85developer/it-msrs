import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdatePhotoAlbumDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого блога!' })
    @IsString({ message: 'id должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    id: string;
    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    albumName: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    userId: string

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}