import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Attachment } from 'nodemailer/lib/mailer';

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
    // @ApiProperty({ example: 'provider', description: 'Имя провайдера AiAssistant моделей.' })
    // @IsOptional()
    // @IsString()
    // readonly provider1?: 'ollama' | 'openai' | 'google'
    // @ApiProperty({ example: 'model', description: 'Имя модели AiAssistant.' })
    // @IsOptional()
    // @IsString()
    // readonly model1?: string;
    // @ApiProperty({ example: 'provider2', description: 'Имя провайдера AiAssistant моделей.' })
    // @IsOptional()
    // @IsString()
    // readonly provider2?: 'ollama' | 'openai' | 'google'
    // @ApiProperty({ example: 'model2', description: 'Имя модели AiAssistant.' })
    // @IsOptional()
    // @IsString()
    // readonly model2?: string;
    @ApiProperty({ example: '2', description: 'ID родительского сообщения, если это ответ' })
    @IsOptional()
    readonly attachments?: Attachment[];
}
