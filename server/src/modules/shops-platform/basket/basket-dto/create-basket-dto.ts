import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBasketDto {
    @ApiProperty({ example: 'userId', description: 'Уникаьный идентификатор пользователя' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    readonly userId: string;

    @ApiProperty({ example: 'shopId', description: 'Уникаьный идентификатор магазина' })
    @IsString({ message: 'shopId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopId не должно быть пустым!' })
    readonly shopId: string;
}