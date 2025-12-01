import { Module, forwardRef } from '@nestjs/common';
import { Confirmation, ConfirmationSchema } from './confirmation-model';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfirmationRepository } from './confirmations-infrastructure/confirmationRepository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Confirmation.name, schema: ConfirmationSchema }]),
    ],
    providers: [
        ConfirmationRepository,
    ],
    exports: [
        ConfirmationRepository,
    ],
})
export class ConfirmationModule { }
