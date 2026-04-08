import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { CreatePromptForTerminatorUseCase } from './ai-assistant-application/ai-assistant-msg.use-cases/create-prompt-for-terminator.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CheckAiClusterConnectionUseCase } from './ai-assistant-application/ai-assistant.use-case/check-ai-cluster-connection-use-case';
import { MessageAiAssistantQueryService } from './ai-assistant-application/msg-ai-assistant-query-service';
import { MessageAiAssistantQueryRepository } from './ai-assistant-infrastrucrure/msg-ai-assistant-query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAssistantMessage, AiAssistantMessageSchema } from './ai-assistant-domain/ai-assistant-msg.entity';
import { AiAssistantDialogsModule } from '../ai-assistant-dialog/ai-assistant-dialog.module';
import { CreateMessageAiAssistantUseCase } from './ai-assistant-application/ai-assistant-msg.use-cases/create-msg-ai-assistant.use-case';
import { MessageAiAssistantRepository } from './ai-assistant-infrastrucrure/msg-ai-assistant.repository';
import { AiAssistantController } from './api-ai-assistant-msg/ai-assistant-msg.controller';
import { AdminQueryService } from '../admin-application/admin-query-service';
import { GetOllamaLocalAiModelsQueryUseCase } from './ai-assistant-application/ai-assistant.use-case/get-ollama-local-models.query.use-case';
import { UpdateAiAssistantMessageUseCase } from './ai-assistant-application/ai-assistant-msg.use-cases/update-msg-ai-assistant.use-case';
import { DeleteAiAssistantOneMessagegUseCase } from './ai-assistant-application/ai-assistant-msg.use-cases/delete-one-msgs-ai-assistant.use-case';
import { DeleteAiAssistantAllMessagesUseCase } from './ai-assistant-application/ai-assistant-msg.use-cases/delete-all-msgs-ai-assistant.use-case';
import { GetGoogleModelsQueryUseCase } from './ai-assistant-application/ai-assistant.use-case/get-google-models.query.use-case';
import { GetAllProvidersModelsQueryUseCase } from './ai-assistant-application/ai-assistant.use-case/get-all-providers-models.query.use-case';
import { GetOpenAiModelsQueryUseCase } from './ai-assistant-application/ai-assistant.use-case/get-open-ai-models-query.use-case';
import { CreateAllRulesForTerminatorsUseCase } from './ai-assistant-application/ai-assistant.use-case/create-rules-for-all-terminators.use-case';
import { DeleteAllRulesForTerminatorsUseCase } from './ai-assistant-application/ai-assistant.use-case/delete-rules-for-all-terminators.use-case';
import { UpdateAiAssistantRulesUseCase } from './ai-assistant-application/ai-assistant.use-case/update-rules-for-all-terminators.use-case';
import { RulesAiAssistantRepository } from './ai-assistant-infrastrucrure/rules-for-ai-assistant.repository';
import { RulesAiAssistant, RulesAiAssistantSchema } from './ai-assistant-domain/ai-assistant-global-context.entity';
import { RulesAiAssistantQueryRepository } from './ai-assistant-infrastrucrure/rules-for-ai-assistant-query.repository';
import { GetAllRulesForTerminatorsQueryUseCase } from './ai-assistant-application/ai-assistant.use-case/get-rules-for-terminators-query.use-case';
import { UpdateDesignatedProviderForAiAssistantUseCase } from './ai-assistant-application/ai-assistant.use-case/update-designated-provider-for-terminator.use-case';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';

const useCases = [
    CreateAllRulesForTerminatorsUseCase,
    UpdateAiAssistantRulesUseCase,
    DeleteAllRulesForTerminatorsUseCase,
    UpdateDesignatedProviderForAiAssistantUseCase,
    CreatePromptForTerminatorUseCase,
    CreateMessageAiAssistantUseCase,
    UpdateAiAssistantMessageUseCase,
    DeleteAiAssistantOneMessagegUseCase,
    DeleteAiAssistantAllMessagesUseCase,
    CheckAiClusterConnectionUseCase,

    GetAllRulesForTerminatorsQueryUseCase,
    MessageAiAssistantQueryService,

    GetAllProvidersModelsQueryUseCase,
    GetGoogleModelsQueryUseCase,
    GetOpenAiModelsQueryUseCase,
    GetOllamaLocalAiModelsQueryUseCase,

    RulesAiAssistantRepository,
    RulesAiAssistantQueryRepository,
    AdminQueryService,
    MessageAiAssistantRepository,
    MessageAiAssistantQueryRepository,
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: AiAssistantMessage.name, schema: AiAssistantMessageSchema }]),
        MongooseModule.forFeature([{ name: RulesAiAssistant.name, schema: RulesAiAssistantSchema }]),
        ConfigModule.forRoot({
            load: [() => ({
                aiNodes: process.env.AI_NODES?.split(','),
            })],
        }),
        CqrsModule,
        HttpModule,
        UserAccountsModule,
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
