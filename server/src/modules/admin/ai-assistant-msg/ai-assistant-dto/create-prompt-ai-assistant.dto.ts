import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Attachment } from 'nodemailer/lib/mailer';

export class CreatePromptAiDto {
    @ApiProperty({ example: 'localId', description: 'Локальный идентификатор сообщения - для обновлении его при ответе сервера.' })
    @IsString()
    @IsNotEmpty()
    readonly localId: string;
    @ApiProperty({ example: 'prompt', description: 'Prompt для консилиума моделей' })
    @IsString()
    @IsNotEmpty()
    readonly prompt: string;
    @ApiProperty({ example: 'senderId', description: 'Уникальный идентификатор отправителя сообщения.' })
    @IsString()
    @IsNotEmpty()
    readonly senderId: string;
    @ApiProperty({ example: 'receiverId', description: 'Уникальный идентификатор модели получателя промпта.' })
    @IsString()
    @IsNotEmpty()
    readonly receiverId: string;

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
