import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DialogAiAssistantRepository } from "./ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository";
import { DialogAiAssistant, DialogAiAssistantSchema } from "./ai-assistant-dialog-domain/ai-assistant-dialog-entity";
import { DialogAiAssistantQueryRepository } from "./ai-assistant-dialog-infrastructure/ai-assistant-dialog-query.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: DialogAiAssistant.name, schema: DialogAiAssistantSchema }])],
    providers: [DialogAiAssistantRepository, DialogAiAssistantQueryRepository],
    exports: [DialogAiAssistantRepository, DialogAiAssistantQueryRepository],
})
export class DialogAiAssistantRepositoryModule { }
