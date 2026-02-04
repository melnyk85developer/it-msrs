import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dialog, DialogSchema } from './dialog-domain/dialog-entity';
import { DialogService } from './dialog-application/dialog-service';
import { DialogQueryService } from './dialog-application/dialog-query-service';
import { DialogRepository } from './dialog-infrastructure/dialog.repository';
import { DialogQueryRepository } from './dialog-infrastructure/dialog-query.repository';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { MessagesModule } from '../msg.module';
import { MessagesQueryRepositoryModule, MessagesRepositoryModule } from '../msg/msg-repository.module';
import { DialogRepositoryModule } from './dialog-repository.module';
import { MessageQueryService } from '../msg/msg-application/msg-query-service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Dialog.name, schema: DialogSchema }]),
        MessagesRepositoryModule,
        DialogRepositoryModule,
        MessagesQueryRepositoryModule,
        UserAccountsModule,
        // MessagesModule
    ],
    providers: [
        DialogService,
        DialogQueryService,
        DialogRepository,
        DialogQueryRepository,

        MessageQueryService
    ],
    exports: [
        DialogService,
        DialogQueryService,
        DialogRepository,
        DialogQueryRepository,

        MessageQueryService
    ],
})
export class DialogsModule { }
