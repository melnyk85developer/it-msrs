import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Attachment } from "nodemailer/lib/mailer";

export class CreateDialogDomainDto {
    @ApiProperty({ example: 'userAId', description: 'Уникальный идентификатор сообщения!' })
    @IsString({ message: 'userAId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userAId не должно быть пустым!' })
    readonly userAId: string;

    @ApiProperty({ example: 'userBId', description: 'Текст сообщения.' })
    @IsString({ message: 'userBId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userBId не должно быть пустым!' })
    readonly userBId: string;
}