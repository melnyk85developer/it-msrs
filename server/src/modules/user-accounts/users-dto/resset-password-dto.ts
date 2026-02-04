import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class RessetPasswordDto {
    @ApiProperty({ example: 'code', description: 'Код для подтверждения сброса пароля!' })
    @IsString({ message: 'code должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле code не должно быть пустым!' })
    readonly recoveryCode: string;
    @ApiProperty({ example: 'qwerty', description: 'Пароль' })
    @IsString({ message: 'Password должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле password не должно быть пустым!' })
    @Length(6, 20, { message: 'Пароль должен быть не меньше 6 и не больше 20 символов!' })
    readonly newPassword: string;
}