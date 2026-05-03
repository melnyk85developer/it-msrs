import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Attachment } from '../../ai-assistant-attachments/attachments-domain/attachments-entity';
import { CreatePromptAiDomainDto } from '../ai-assistant-msg-dto/create-prompt-ai-assistant-domain.dto';
import { UpdateMsgMetaAiAssistantDomainDto } from '../ai-assistant-msg-dto/update-msg-meta-ai-assistant.dto';
import { UpdateMessageAiAssistantDomainDto } from '../ai-assistant-msg-dto/update-msg-ai-assistant-domain.dto';

@Schema({
    // _id: false,
    // timestamps: true, 
    collection: 'ai_assistant_message',
    toJSON: { virtuals: true }
})
export class AiAssistantMessage {
    @ApiProperty({ example: 'role', description: 'Роль Ассистента Терминатора.' })
    @Prop({ type: String, required: false })
    role: string;

    @ApiProperty({ example: 'content', description: 'Последнее посещение пользователя.' })
    @Prop({ type: String, required: true })
    content: string;

    @ApiProperty({ example: '42', description: 'ID отправителя' })
    @Prop({ type: String, required: true })
    senderId: string;

    @ApiProperty({ example: '84', description: 'ID получателя' })
    @Prop({ type: String, required: true })
    receiverId: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID диалога' })
    @Prop({ type: String, required: true })
    dialogId: string;

    @ApiProperty({ example: '2', description: 'ID родительского сообщения, если это ответ' })
    @Prop({ type: [Object], required: false, default: [] })
    attachments: Attachment[];

    @ApiProperty({ example: [], description: 'Системная информация: кто удалил, когда и т.д.' })
    @Prop({ type: [Object], required: false, default: [] })
    meta: any[];

    @ApiProperty({ example: 'createdAt', description: 'Число создания аккаунта.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления аккаунта.' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления  аккаунта.' })
    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createAiAssistantMessageInstance(dto: CreatePromptAiDomainDto): AiAssistantMessageDocument {
        // console.log('AiAssistantMessageEntity: createAiAssistantMessageInstance - dto 😡 ', dto)
        const message = new this();
        const date = new Date();
        const createdAt = date.toISOString();

        message.content = dto.content;
        message.senderId = dto.senderId;
        message.receiverId = dto.receiverId;
        message.dialogId = dto.dialogId;
        message.meta = [];
        message.attachments = []

        message.createdAt = createdAt;
        message.updatedAt = createdAt;
        message.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return message as AiAssistantMessageDocument;
    }
    updateAiAssistantMessage(dto: UpdateMessageAiAssistantDomainDto) {
        if (this.id === dto.msgId) {
            this.content = dto.prompt;
            this.senderId = dto.senderId;
            this.receiverId = dto.receiverId;
            this.dialogId = this.dialogId;
            this.meta = this.meta;
            this.attachments = this.attachments;

            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt;
        }
    }
    markMsgDeletedForUser(dto: UpdateMsgMetaAiAssistantDomainDto) {
        if (this.id === dto.msgId) {
            this.content = this.content;
            this.senderId = this.senderId;
            this.receiverId = this.receiverId;
            this.dialogId = this.dialogId;
            // message.attachments = dto.attachments;
            this.meta = dto.meta;

            this.createdAt = this.createdAt;
            this.updatedAt = this.updatedAt;
            this.deletedAt = this.deletedAt;
        }
    }
}
export const AiAssistantMessageSchema = SchemaFactory.createForClass(AiAssistantMessage);
//регистрирует методы сущности в схеме
AiAssistantMessageSchema.loadClass(AiAssistantMessage);
// Подключает виртуально BlogSchema в UserSchema
// AiAssistantMessageSchema.virtual('blogs', {
//     ref: 'Blog',
//     localField: '_id',
//     foreignField: 'blogId',
// });
// AiAssistantMessageSchema.virtual('photo_album', {
//     ref: 'PhotoAlbum',
//     localField: '_id',
//     foreignField: 'albumId',
// });
//Типизация документа
export type AiAssistantMessageDocument = HydratedDocument<AiAssistantMessage>;
//Типизация модели + статические методы
export type AiAssistantMessageModelType = Model<AiAssistantMessageDocument> & typeof AiAssistantMessage;