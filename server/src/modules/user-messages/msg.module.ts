import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './msg/msg-domain/msg-entity';
import { MessageService } from './msg/msg-application/msg-service';
import { MessageRepository } from './msg/msg-infrastructure/msg.repository';
import { MessageQueryRepository } from './msg/msg-infrastructure/msg-query.repository';
import { UsersMessagesController } from './msg/msg-api/msg-controller';
import { DialogsModule } from './dialog/dialog.module';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { MessagesRepositoryModule } from './msg/msg-repository.module';
import { DialogRepositoryModule } from './dialog/dialog-repository.module';
import { MessageQueryService } from './msg/msg-application/msg-query-service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        MessagesRepositoryModule,
        DialogRepositoryModule,
        UserAccountsModule,
        DialogsModule
    ],
    controllers: [
        UsersMessagesController
    ],
    providers: [
        MessageService,
        MessageQueryService,
        MessageRepository,
        MessageQueryRepository,
    ],
    exports: [
        MessageService,
        MessageQueryService,
        MessageRepository,
        MessageQueryRepository,
    ],
})
export class MessagesModule { }
