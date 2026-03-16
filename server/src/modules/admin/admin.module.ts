import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { AdminController } from './api-admin/admin.controller';
import { AdminAiAssistantModule } from './ai-assistant/admin-ai-assistant.module';
import { AdminService } from './admin-application/admin-query-service';

@Module({
    imports: [
        CqrsModule, 
        HttpModule,
        AdminAiAssistantModule
    ],
    controllers: [
        AdminController
    ],
    providers: [
        AdminService
    ]
})
export class AdminModule {}
