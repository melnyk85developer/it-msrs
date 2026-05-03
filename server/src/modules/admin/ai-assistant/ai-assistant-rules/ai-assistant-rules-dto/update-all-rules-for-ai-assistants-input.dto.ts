import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Attachment } from "nodemailer/lib/mailer";

export class UpdateRulesAiAssistantInputDto {
    @ApiProperty({ example: 'id', description: 'Уникальный идентификатор настроек!' })
    @IsString({ message: 'id должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    readonly id: string;
    @ApiProperty({ example: 'titleRules', description: 'Заголовок системных настроек ассистента.' })
    @IsString()
    @IsNotEmpty()
    readonly titleRules: string;
    @ApiProperty({ example: 'contentRules', description: 'Глобальные настройки контекста ассистента.' })
    @IsString()
    @IsNotEmpty()
    readonly contentRules: string;
}