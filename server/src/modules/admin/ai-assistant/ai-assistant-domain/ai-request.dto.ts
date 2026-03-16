import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAiRequestDto {
    @ApiProperty({ example: 'Проанализируй контент на предмет токсичности', description: 'Запрос для консилиума' })
    @IsString()
    @IsNotEmpty()
    readonly prompt: string;
}
