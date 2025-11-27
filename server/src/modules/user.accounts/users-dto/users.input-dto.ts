import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateUserInputDto {
    @ApiProperty({ example: 'login', description: 'Samuray - Логин пользователя!' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    @Length(2, 16, { message: 'Длина логина должена быть не меньше 2 и не больше 16 символов!' })
    readonly login: string;
    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'Email должен быть строкой!' })
    @IsNotEmpty({ message: 'Поле email не должно быть пустым!' })
    @IsEmail({}, { message: "Некорректный E-mail" })
    readonly email: string;
    @ApiProperty({ example: 'qwerty', description: 'Пароль' })
    @IsString({ message: 'Password должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле password не должно быть пустым!' })
    @Length(6, 16, { message: 'Пароль должен быть не меньше 6 и не больше 16 символов!' })
    readonly password: string;
}