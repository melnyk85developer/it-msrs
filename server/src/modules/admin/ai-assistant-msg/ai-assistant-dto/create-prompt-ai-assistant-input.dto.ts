import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePromptAiInputDto {
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

    @ApiProperty({ example: 'receiverId', description: 'Уникальный идентификатор диалога.' })
    @IsOptional()
    @IsString()
    readonly dialogId?: string;

    @ApiProperty({ example: 'createdAt', description: 'Локальное время создания промпта.' })
    @IsString()
    @IsNotEmpty()
    readonly createdAt: string;
    @ApiProperty({ example: 'model', description: 'Имя модели AiAssistant.' })
    @IsOptional()
    @IsString()
    model?: string;
    @ApiProperty({ example: 'model', description: 'Имя провайдера AiAssistant моделей.' })
    @IsOptional()
    @IsString()
    provider?: 'ollama' | 'external' | 'google'
}
