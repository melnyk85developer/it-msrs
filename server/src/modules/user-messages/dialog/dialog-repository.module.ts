import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Dialog, DialogSchema } from "./dialog-domain/dialog-entity";
import { DialogRepository } from "./dialog-infrastructure/dialog.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: Dialog.name, schema: DialogSchema }])],
    providers: [DialogRepository],
    exports: [DialogRepository],
})
export class DialogRepositoryModule { }
