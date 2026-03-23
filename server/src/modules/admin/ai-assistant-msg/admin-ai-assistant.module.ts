import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { CreatePromptForTerminatorUseCase } from './ai-assistant-application/ai-assistant-msg-use-case/create-prompt-for-terminator.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CheckAiClusterConnectionUseCase } from './ai-assistant-application/ai-assistant-msg-use-case/check-ai-cluster-connection-use-case';
import { MessageAiAssistantQueryService } from './ai-assistant-application/msg-ai-assistant-query-service';
import { MessageAiAssistantQueryRepository } from './ai-assistant-infrastrucrure/msg-ai-assistant-query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAssistantMessage, AiAssistantMessageSchema } from './ai-assistant-domain/ai-assistant.entity';
import { AiAssistantDialogsModule } from '../ai-assistant-dialog/ai-assistant-dialog.module';
import { CreateMessageAiAssistantUseCase } from './ai-assistant-application/ai-assistant-msg-use-case/create-msg-ai-assistant.use-case';
import { MessageAiAssistantRepository } from './ai-assistant-infrastrucrure/msg-ai-assistant.repository';
import { AiAssistantController } from './api-ai-assistant-msg/ai-assistant-msg.controller';
import { AdminQueryService } from '../admin-application/admin-query-service';
import { GetAiModelsQueryService } from './ai-assistant-application/get-ai-models.query-service';

const useCases = [
    CreatePromptForTerminatorUseCase,
    CreateMessageAiAssistantUseCase,
    CheckAiClusterConnectionUseCase,
    MessageAiAssistantQueryService,

    AdminQueryService,
    MessageAiAssistantRepository,
    MessageAiAssistantQueryRepository,
    GetAiModelsQueryService,
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: AiAssistantMessage.name, schema: AiAssistantMessageSchema }]),
        ConfigModule.forRoot({
            load: [() => ({
                aiNodes: process.env.AI_NODES?.split(','),
            })],
        }),
        CqrsModule,
        HttpModule,
        AiAssistantDialogsModule
    ],
    controllers: [
        AiAssistantController
    ],
    providers: [
        ...useCases,
        {
            provide: 'AI_CONFIG',
            useFactory: (configService: ConfigService) => {
                return configService.get('aiNodes');
            },
            inject: [ConfigService],
        },
    ],
    exports: [...useCases],
})
export class AdminAiAssistantModule { }
