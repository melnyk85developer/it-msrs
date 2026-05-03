import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePromptAiDomainDto {
    @ApiProperty({ example: 'localId', description: 'Локальный идентификатор сообщения - для обновлении его при ответе сервера.' })
    @IsString()
    @IsNotEmpty()
    readonly localId: string;
    @ApiProperty({ example: 'content', description: 'Prompt для консилиума моделей' })
    @IsString()
    @IsNotEmpty()
    readonly content: string;
    @ApiProperty({ example: 'senderId', description: 'Уникальный идентификатор отправителя сообщения.' })
    @IsString()
    @IsNotEmpty()
    readonly senderId: string;
    @ApiProperty({ example: 'receiverId', description: 'Уникальный идентификатор модели получателя промпта.' })
    @IsString()
    @IsNotEmpty()
    readonly receiverId: string;
    @ApiProperty({ example: 'true', description: 'Уникальный идентификатор диалога!' })
    @IsString({ message: 'dialogId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле dialogId не должно быть пустым!' })
    readonly dialogId: string;
}
