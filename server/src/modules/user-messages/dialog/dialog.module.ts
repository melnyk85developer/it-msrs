import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dialog, DialogSchema } from './dialog-domain/dialog-entity';
import { DialogQueryService } from './dialog-application/dialog-query-service';
import { DialogRepository } from './dialog-infrastructure/dialog.repository';
import { DialogQueryRepository } from './dialog-infrastructure/dialog-query.repository';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { MessagesQueryRepositoryModule, MessagesRepositoryModule } from '../msg/msg-repository.module';
import { DialogRepositoryModule } from './dialog-repository.module';
import { MessageQueryService } from '../msg/msg-application/msg-query-service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateDialogUseCase } from './dialog-application/dialog-use-cases/create-dialog.use-case';
import { UpdateDialogUseCase } from './dialog-application/dialog-use-cases/update-dialog.use-case';
import { DeleteDialogUseCase } from './dialog-application/dialog-use-cases/delete-dialog.use-case';

const useCases = [
    CreateDialogUseCase,
    UpdateDialogUseCase,
    DeleteDialogUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Dialog.name, schema: DialogSchema }]),
        CqrsModule,
        MessagesRepositoryModule,
        DialogRepositoryModule,
        MessagesQueryRepositoryModule,
        UserAccountsModule,
    ],
    providers: [
        ...useCases,
        DialogQueryService,
        DialogRepository,
        DialogQueryRepository,

        MessageQueryService
    ],
    exports: [
        DialogQueryService,
        DialogRepository,
        DialogQueryRepository,

        MessageQueryService
    ],
})
export class DialogsModule { }
