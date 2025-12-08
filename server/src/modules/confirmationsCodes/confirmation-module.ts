import { Module, forwardRef } from '@nestjs/common';
import { Confirmation, ConfirmationSchema } from './confirmations-domain/confirmation-entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfirmationRepository } from './confirmations-infrastructure/confirmationRepository';
import { ConfirmationsCodesService } from './confirmations-application/confirmations.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Confirmation.name, schema: ConfirmationSchema }]),
    ],
    providers: [
        ConfirmationsCodesService,
        ConfirmationRepository,
    ],
    exports: [
        ConfirmationsCodesService,
        ConfirmationRepository,
    ],
})
export class ConfirmationModule { }
