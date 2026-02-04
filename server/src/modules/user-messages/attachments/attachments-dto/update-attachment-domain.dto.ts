import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Attachment } from "nodemailer/lib/mailer";

export class UpdateAttachmentDto {
    @ApiProperty({ example: 'attachmentId', description: 'Уникальный идентификатор вложения!' })
    @IsString({ message: 'attachmentId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле attachmentId не должно быть пустым!' })
    readonly attachmentId: string;
    @ApiProperty({ example: 'messageId', description: 'Уникальный идентификатор сообщения!' })
    @IsString({ message: 'messageId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле msgId не должно быть пустым!' })
    readonly messageId: string;
    @ApiProperty({ example: 'url', description: 'url адрес вложение.' })
    @IsString({ message: 'url должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле url не должно быть пустым!' })
    readonly url: string;
    @ApiProperty({ example: 'mimeType', description: 'Уникальный идентификатор отправителя!' })
    @IsString({ message: 'mimeType должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле mimeType не должно быть пустым!' })
    readonly mimeType: string;
}