import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DialogAiAssistantQueryService } from './ai-assistant-dialog-application/ai-assistant-dialog-query-service';
import { DialogAiAssistantRepository } from './ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository';
import { DialogAiAssistantQueryRepository } from './ai-assistant-dialog-infrastructure/ai-assistant-dialog-query.repository';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateDialogAiAssistantUseCase } from './ai-assistant-dialog-application/ai-assistant-dialog-use-cases/create-ai-assistant-dialog.use-case';
import { UpdateDialogAiAssistantUseCase } from './ai-assistant-dialog-application/ai-assistant-dialog-use-cases/update-ai-assistant-dialog.use-case';
import { DeleteDialogAiAssistantUseCase } from './ai-assistant-dialog-application/ai-assistant-dialog-use-cases/delete-ai-assistant-dialog.use-case';
import { DialogAiAssistant, DialogAiAssistantSchema } from './ai-assistant-dialog-domain/ai-assistant-dialog-entity';
import { DialogAiAssistantRepositoryModule } from './ai-assistant-dialog-repository.module';
import { MessageAiAssistantQueryService } from '../ai-assistant-msg/ai-assistant-application/msg-ai-assistant-query-service';
import { MessagesAiAssistantQueryRepositoryModule, MessagesAiAssistantRepositoryModule } from '../ai-assistant-msg/msg-ai-assistant-repository.module';
import { AdminAiAssistantModule } from '../ai-assistant-msg/admin-ai-assistant.module';
import { HttpService } from '@nestjs/axios';

const useCases = [
    CreateDialogAiAssistantUseCase,
    UpdateDialogAiAssistantUseCase,
    DeleteDialogAiAssistantUseCase,
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: DialogAiAssistant.name, schema: DialogAiAssistantSchema }]),
        CqrsModule,
        // HttpService,
        MessagesAiAssistantRepositoryModule,
        DialogAiAssistantRepositoryModule,
        MessagesAiAssistantQueryRepositoryModule,
        UserAccountsModule,
        // AdminAiAssistantModule
    ],
    providers: [
        ...useCases,
        DialogAiAssistantQueryService,
        DialogAiAssistantRepository,
        DialogAiAssistantQueryRepository,

        MessageAiAssistantQueryService
    ],
    exports: [
        DialogAiAssistantQueryService,
        DialogAiAssistantRepository,
        DialogAiAssistantQueryRepository,

        MessageAiAssistantQueryService
    ],
})
export class AiAssistantDialogsModule { }
