import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { CreatePromptForTerminatorUseCase } from './ai-assistant-msg-application/ai-assistant-msg.use-cases/create-prompt-for-terminator.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CheckAiClusterConnectionUseCase } from '../../ai-assistant.use-case/check-ai-cluster-connection-use-case';
import { MessageAiAssistantQueryService } from './ai-assistant-msg-application/msg-ai-assistant-query-service';
import { MessageAiAssistantQueryRepository } from './ai-assistant-msg-infrastrucrure/msg-ai-assistant-query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAssistantMessage, AiAssistantMessageSchema } from './ai-assistant-msg-domain/ai-assistant-msg.entity';
import { AiAssistantDialogsModule } from '../ai-assistant-dialog/ai-assistant-dialog.module';
import { CreateMessageAiAssistantUseCase } from './ai-assistant-msg-application/ai-assistant-msg.use-cases/create-msg-ai-assistant.use-case';
import { MessageAiAssistantRepository } from './ai-assistant-msg-infrastrucrure/msg-ai-assistant.repository';
import { AiAssistantController } from './ai-assistant-msg-api/ai-assistant-msg.controller';
import { AdminQueryService } from '../../../admin-application/admin-query-service';
import { GetOllamaLocalAiModelsQueryUseCase } from '../../ai-assistant.use-case/get-ollama-local-models.query.use-case';
import { UpdateAiAssistantMessageUseCase } from './ai-assistant-msg-application/ai-assistant-msg.use-cases/update-msg-ai-assistant.use-case';
import { DeleteAiAssistantOneMessagegUseCase } from './ai-assistant-msg-application/ai-assistant-msg.use-cases/delete-one-msg-ai-assistant.use-case';
import { DeleteAiAssistantAllMessagesUseCase } from './ai-assistant-msg-application/ai-assistant-msg.use-cases/delete-all-msgs-ai-assistant.use-case';
import { GetGoogleModelsQueryUseCase } from '../../ai-assistant.use-case/get-google-models.query.use-case';
import { GetAllProvidersModelsQueryUseCase } from '../../ai-assistant.use-case/get-all-providers-models.query.use-case';
import { GetOpenAiModelsQueryUseCase } from '../../ai-assistant.use-case/get-open-ai-models-query.use-case';
import { RulesAiAssistantRepository } from '../../ai-assistant-rules/ai-assistant-rules-infrastrucrure/rules-for-ai-assistant.repository';
import { RulesAiAssistant, RulesAiAssistantSchema } from '../../ai-assistant-rules/ai-assistant-rules-damain/ai-assistant-global-context.entity';
import { RulesAiAssistantQueryRepository } from '../../ai-assistant-rules/ai-assistant-rules-infrastrucrure/rules-for-ai-assistant-query.repository';
import { UpdateDesignatedProviderForAiAssistantUseCase } from '../../ai-assistant.use-case/update-designated-provider-for-terminator.use-case';
import { UserAccountsModule } from '../../../../user-accounts/user-accounts.module';
import { CreateAllRulesForTerminatorsUseCase } from '../../ai-assistant-rules/ai-assistant-rules-application/create-rules-for-all-terminators.use-case';
import { UpdateAiAssistantRulesUseCase } from '../../ai-assistant-rules/ai-assistant-rules-application/update-rules-for-all-terminators.use-case';
import { DeleteAllRulesForTerminatorsUseCase } from '../../ai-assistant-rules/ai-assistant-rules-application/delete-rules-for-all-terminators.use-case';
import { GetAllRulesForTerminatorsQueryUseCase } from '../../ai-assistant-rules/ai-assistant-rules-application/get-rules-for-terminators-query.use-case';
import { EmbeddingModule } from '../../ai-assistant-embedding/embedding.module';
import { FileParserService } from 'src/modules/files/fileParserService';
import { GetDialogAiAssistantQueryUseCase } from '../ai-assistant-dialog/ai-assistant-dialog-application/get-dialog-ai-assistant.query.use-case';

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

    GetDialogAiAssistantQueryUseCase,

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

    FileParserService
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
        EmbeddingModule,
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
