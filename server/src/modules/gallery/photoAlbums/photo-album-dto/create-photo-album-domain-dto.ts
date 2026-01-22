import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePhotoAlbumDomainDto {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    readonly userId: string

    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    readonly albumName: string;

    @ApiProperty({ example: 'albumCoverName', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'albumCoverName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле miniature не должно быть пустым!' })
    readonly albumCoverName: string | null;

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}