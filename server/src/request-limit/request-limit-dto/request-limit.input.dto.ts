import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Attachment } from "nodemailer/lib/mailer";

export class RequestLimitInputDto {
    @ApiProperty({ example: '192.168.1.1', description: 'IP адрес пользователя' })
    @IsOptional()
    @IsString({ message: 'ip должно быть строкой!' })
    readonly ip: string;
    @ApiProperty({ example: 'url', description: 'URL страницы' })
    @IsOptional()
    @IsString({ message: 'url должно быть строкой!' })
    readonly url: string;
    @ApiProperty({ example: 'date', description: 'Дата и время отправки!' })
    @IsOptional()
    @IsString({ message: 'date должно быть строкой!' })
    readonly date: string;
}