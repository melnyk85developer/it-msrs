import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Trim } from "src/core/decorators/transform/trim";

export class EmailResendingDto {
    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @Length(3, 50, { message: 'Email должен быть не меньше 3 и не больше 20 символов!' })
    @IsString({ message: 'Email должен быть строкой!' })
    @IsNotEmpty({ message: 'Поле email не должно быть пустым!' })
    @IsEmail({}, { message: "Некорректный E-mail" })
    readonly email: string;
}
//@Length(3, 50, { message: 'Email должен быть не меньше 3 и не больше 20 символов!' })