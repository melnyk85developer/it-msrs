import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { OrchestrateAiRequestUseCase } from './ai-assistant-application/orchestrate-ai-request.use-case';
import { OllamaClusterService } from './ai-assistant-infrastrucrure/ollama-cluster.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [() => ({
                aiNodes: process.env.AI_NODES?.split(','),
            })],
        }),
        CqrsModule,
        HttpModule
    ],
    providers: [
        OrchestrateAiRequestUseCase,
        OllamaClusterService,
        {
            provide: 'AI_CONFIG',
            useFactory: (configService: ConfigService) => {
                return configService.get('aiNodes');
            },
            inject: [ConfigService],
        },
    ]
})
export class AdminAiAssistantModule { }
