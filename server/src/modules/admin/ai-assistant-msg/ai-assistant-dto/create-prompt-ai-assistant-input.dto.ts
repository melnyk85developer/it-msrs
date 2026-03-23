import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

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

    @ApiProperty({ example: 'createdAt', description: 'Локальное время создания промпта.' })
    @IsString()
    @IsNotEmpty()
    readonly createdAt: string;

    model?: string;
    provider?: 'ollama' | 'external' | 'google'
}
