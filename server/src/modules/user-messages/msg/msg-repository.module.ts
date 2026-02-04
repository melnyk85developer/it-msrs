import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./msg-domain/msg-entity";
import { MessageRepository } from "./msg-infrastructure/msg.repository";
import { MessageQueryRepository } from "./msg-infrastructure/msg-query.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
    providers: [MessageRepository],
    exports: [MessageRepository],
})
export class MessagesRepositoryModule { }

@Module({
    imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
    providers: [MessageQueryRepository],
    exports: [MessageQueryRepository],
})
export class MessagesQueryRepositoryModule { }
