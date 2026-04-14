import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Multer } from 'multer';
import { Trim } from "src/core/decorators/transform/trim";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateMerchandiseBrandInputDto {
    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'shopId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopId не должно быть пустым!' })
    readonly shopId: string

    @ApiProperty({ example: 'Apple', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'merchandiseBrandName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseBrandName не должно быть пустым!' })
    readonly merchandiseBrandName: string;
}