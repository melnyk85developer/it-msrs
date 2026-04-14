import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Multer } from 'multer';
import { Trim } from "src/core/decorators/transform/trim";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateMerchandiseTypeInputDto {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    readonly shopId: string
    @ApiProperty({ example: 'Продукты', description: 'Тип товара' })
    @IsString({ message: 'merchandiseTypeName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseTypeName не должно быть пустым!' })
    readonly merchandiseTypeName: string;
}