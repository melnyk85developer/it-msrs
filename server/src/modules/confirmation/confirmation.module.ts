import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Confirmation, ConfirmationSchema } from './confirmation-domain/confirmation.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Confirmation.name, schema: ConfirmationSchema }]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class ConfirmationModule { }