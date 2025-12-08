import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class RessetPasswordDto {
    @ApiProperty({ example: 'code', description: 'Код для подтверждения сброса пароля!' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле code не должно быть пустым!' })
    readonly code: string;
    @ApiProperty({ example: 'qwerty', description: 'Пароль' })
    @IsString({ message: 'Password должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле password не должно быть пустым!' })
    readonly password: string;
}