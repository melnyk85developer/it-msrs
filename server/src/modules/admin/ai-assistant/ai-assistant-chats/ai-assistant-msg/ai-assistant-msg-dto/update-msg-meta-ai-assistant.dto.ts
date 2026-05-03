import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Attachment } from "nodemailer/lib/mailer";

export class UpdateMsgMetaAiAssistantDomainDto {
    @ApiProperty({ example: 'msgId', description: 'Уникальный идентификатор сообщения!' })
    @IsString({ message: 'msgId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле msgId не должно быть пустым!' })
    readonly msgId: string;

    @ApiProperty({ example: 'true', description: 'Уникальный идентификатор диалога!' })
    @IsNotEmpty({ message: 'Поле dialogId не должно быть пустым!' })
    readonly meta: any[];
}