import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Multer } from 'multer';
import { Trim } from "src/core/decorators/transform/trim";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateMerchandiseInfoInputDto {
    @ApiProperty({ example: 'title', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле title не должно быть пустым!' })
    readonly title: string;

    @ApiProperty({ example: 'description', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'description должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле description не должно быть пустым!' })
    readonly description: string;

    @ApiProperty({ example: 'merchandiseId', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'merchandiseId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseId не должно быть пустым!' })
    readonly merchandiseId: string;

    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'shopId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopId не должно быть пустым!' })
    readonly shopId: string;
}