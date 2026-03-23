import { Injectable } from '@nestjs/common';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

@Injectable()
export class AiAssistantConfig {
    @IsArray()
    @ArrayMinSize(1)
    @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
    aiNodes: string[];

    constructor(config: Record<string, any>) {
        this.aiNodes = config.AI_NODES;
    }
}