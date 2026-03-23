import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { AdminAiAssistantModule } from './ai-assistant-msg/admin-ai-assistant.module';
import { AdminQueryService } from './admin-application/admin-query-service';;
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { DialogAiAssistantRepositoryModule } from './ai-assistant-dialog/ai-assistant-dialog-repository.module';

const useCases = [
    AdminQueryService,
]

@Module({
    imports: [
        CqrsModule,
        HttpModule,
        AdminAiAssistantModule,
        UserAccountsModule,
        DialogAiAssistantRepositoryModule
    ],
    // controllers: [
    //     AdminController
    // ],
    providers: [
        ...useCases
    ],
    exports: [...useCases],
})
export class AdminModule { }
