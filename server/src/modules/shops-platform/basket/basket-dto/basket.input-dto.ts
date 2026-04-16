import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Multer } from 'multer';
import { Trim } from "src/core/decorators/transform/trim";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateBasketInputDto {
    @ApiProperty({ example: 'userId', description: 'Уникаьный идентификатор пользователя' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    readonly userId: string;

    // @ApiProperty({ example: 'shopId', description: 'Уникаьный идентификатор магазина' })
    // @IsString({ message: 'shopId должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле shopId не должно быть пустым!' })
    // readonly shopId: string;
}