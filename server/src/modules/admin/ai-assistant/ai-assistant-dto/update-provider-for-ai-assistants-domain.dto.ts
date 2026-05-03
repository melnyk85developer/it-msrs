import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Attachment } from "nodemailer/lib/mailer";

export class UpdateProviderForAiAssistantDomainDto {
    @ApiProperty({ example: 'id', description: 'Уникальный идентификатор настроек!' })
    @IsString({ message: 'id должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    readonly id: string;
    @ApiProperty({ example: 'titleRules', description: 'Заголовок системных настроек ассистента.' })
    @IsString()
    @IsNotEmpty()
    readonly provider1: string;
    @ApiProperty({ example: 'contentRules', description: 'Глобальные настройки контекста ассистента.' })
    @IsString()
    @IsNotEmpty()
    readonly model1: string;
    @ApiProperty({ example: 'titleRules', description: 'Заголовок системных настроек ассистента.' })
    @IsString()
    @IsNotEmpty()
    readonly provider2: string;
    @ApiProperty({ example: 'contentRules', description: 'Глобальные настройки контекста ассистента.' })
    @IsString()
    @IsNotEmpty()

    readonly model2: string;
    @ApiProperty({ example: 'node', description: 'IP адрес локального сервера или ПК (не обязательно)' })
    @IsOptional()
    @IsString()
    readonly node: string;

    @ApiProperty({ example: ['id1', 'id2'], description: 'Список ID системных промптов' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true }) // Вот это критически важно: проверка, что каждый элемент - строка
    readonly systemPrompts: string[];
}