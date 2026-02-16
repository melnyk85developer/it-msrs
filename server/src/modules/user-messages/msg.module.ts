import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './msg/msg-domain/msg-entity';
import { MessageRepository } from './msg/msg-infrastructure/msg.repository';
import { MessageQueryRepository } from './msg/msg-infrastructure/msg-query.repository';
import { UsersMessagesController } from './msg/msg-api/msg-controller';
import { DialogsModule } from './dialog/dialog.module';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { MessagesRepositoryModule } from './msg/msg-repository.module';
import { DialogRepositoryModule } from './dialog/dialog-repository.module';
import { MessageQueryService } from './msg/msg-application/msg-query-service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateMessageUseCase } from './msg/msg-application/msg-use-cases/create-msg.use-case';
import { DeleteAllMessageUseCase } from './msg/msg-application/msg-use-cases/delete-all-msgs.use-case';
import { DeleteOneMessagegUseCase } from './msg/msg-application/msg-use-cases/delete-one-msgs.use-case';
import { UpdateReadMsgUseCase } from './msg/msg-application/msg-use-cases/update-read-msg.use-case';
import { UpdateMessageUseCase } from './msg/msg-application/msg-use-cases/update-msg.use-case';
import { DeleteDialogCommand } from './dialog/dialog-application/dialog-use-cases/delete-dialog.use-case';

const useCases = [
    DeleteDialogCommand,
    CreateMessageUseCase,
    DeleteAllMessageUseCase,
    DeleteOneMessagegUseCase,
    UpdateMessageUseCase,
    UpdateReadMsgUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        CqrsModule,
        MessagesRepositoryModule,
        DialogRepositoryModule,
        UserAccountsModule,
        DialogsModule
    ],
    controllers: [
        UsersMessagesController
    ],
    providers: [
        ...useCases,
        MessageQueryService,
        MessageRepository,
        MessageQueryRepository,
    ],
    exports: [
        MessageQueryService,
        MessageRepository,
        MessageQueryRepository,
    ],
})
export class MessagesModule { }
