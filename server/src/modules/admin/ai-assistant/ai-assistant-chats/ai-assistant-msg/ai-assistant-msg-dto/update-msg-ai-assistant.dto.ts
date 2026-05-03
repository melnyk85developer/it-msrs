import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Attachment } from "nodemailer/lib/mailer";

export class UpdateMessageAiAssistantDto {
    @ApiProperty({ example: 'msgId', description: 'Уникальный идентификатор сообщения!' })
    @IsString({ message: 'msgId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле msgId не должно быть пустым!' })
    readonly msgId: string;
    @ApiProperty({ example: 'prompt', description: 'Prompt для консилиума моделей' })
    @IsString()
    @IsNotEmpty()
    prompt: string;
    @ApiProperty({ example: 'senderId', description: 'Уникальный идентификатор отправителя сообщения.' })
    @IsString()
    @IsNotEmpty()
    readonly senderId: string;
    @ApiProperty({ example: 'receiverId', description: 'Уникальный идентификатор модели получателя промпта.' })
    @IsString()
    @IsNotEmpty()
    readonly receiverId: string;
    @ApiProperty({ example: 'dialogId', description: 'Уникальный идентификатор диалога.' })
    @IsString()
    @IsNotEmpty()
    readonly dialogId: string;
    @ApiProperty({ example: 'createdAt', description: 'Локальное время создания промпта.' })
    @IsString()
    @IsNotEmpty()
    readonly createdAt: string;
    @ApiProperty({ example: 'model', description: 'Имя модели AiAssistant.' })
    @IsOptional()
    @IsString()
    readonly model?: string;
    @ApiProperty({ example: 'model', description: 'Имя провайдера AiAssistant моделей.' })
    @IsOptional()
    @IsString()
    readonly provider?: 'ollama' | 'openai' | 'google'
    @ApiProperty({ example: '2', description: 'ID родительского сообщения, если это ответ' })
    @IsOptional()
    readonly attachments?: Attachment[];
}