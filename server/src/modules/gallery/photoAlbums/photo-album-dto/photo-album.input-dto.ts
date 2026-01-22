import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Multer } from 'multer';
import { Trim } from "src/core/decorators/transform/trim";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreatePhotoAlbumInputDto {
    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    readonly albumName: string;
}