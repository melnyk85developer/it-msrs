import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdateMyShopsDto {
    @ApiProperty({ example: 'Визит', description: 'Название магазина' })
    @IsString({ message: 'name должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле name не должно быть пустым!' })
    readonly name: string;

    @ApiProperty({ example: 'Компьютерная техника', description: 'Название подзаголовка' })
    @IsString({ message: 'Title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    readonly title: string;

    @ApiProperty({ example: 'Компьютерная техника', description: 'Название подзаголовка' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    readonly userId: string;

    @ApiProperty({ example: 'Компьютерная техника', description: 'Название подзаголовка' })
    @IsString({ message: 'shopTypeId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shopTypeId не должно быть пустым!' })
    readonly shopTypeId: string;
}