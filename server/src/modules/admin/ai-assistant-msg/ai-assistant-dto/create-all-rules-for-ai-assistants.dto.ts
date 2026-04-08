import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAllRulesAiAssistantDto {
    @ApiProperty({ example: 'titleRules', description: 'Заголовок системных настроек ассистента.' })
    @IsString()
    @IsNotEmpty()
    readonly titleRules: string;
    @ApiProperty({ example: 'contentRules', description: 'Глобальные настройки контекста ассистента.' })
    @IsString()
    @IsNotEmpty()
    readonly contentRules: string;
}
