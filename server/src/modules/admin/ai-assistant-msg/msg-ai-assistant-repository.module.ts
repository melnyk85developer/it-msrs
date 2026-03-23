import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AiAssistantMessage, AiAssistantMessageSchema  } from "./ai-assistant-domain/ai-assistant.entity";
import { MessageAiAssistantQueryRepository } from "./ai-assistant-infrastrucrure/msg-ai-assistant-query.repository";
import { MessageAiAssistantRepository } from "./ai-assistant-infrastrucrure/msg-ai-assistant.repository";


@Module({
    imports: [MongooseModule.forFeature([{ name: AiAssistantMessage.name, schema: AiAssistantMessageSchema }])],
    providers: [MessageAiAssistantRepository],
    exports: [MessageAiAssistantRepository],
})
export class MessagesAiAssistantRepositoryModule { }

@Module({
    imports: [MongooseModule.forFeature([{ name: AiAssistantMessage.name, schema: AiAssistantMessageSchema }])],
    providers: [MessageAiAssistantQueryRepository],
    exports: [MessageAiAssistantQueryRepository],
})
export class MessagesAiAssistantQueryRepositoryModule { }
