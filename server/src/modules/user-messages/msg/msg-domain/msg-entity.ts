import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreateMessageDomainDto, } from "../msg-dto/create-msg-domain.dto";
import { Dialog } from "../../dialog/dialog-domain/dialog-entity";
import { Attachment } from "../../attachments/attachments-domain/attachments-entity";
import { UpdateMessageDomainDto } from "../msg-dto/update-msg-domain.dto";
import { UpdateMessageReadDomainDto } from "../msg-dto/update-msg-read-domain.dto";
import { UpdateMsgMetaDomainDto } from "../msg-dto/update-msg-meta.dto";

@Schema({
    // timestamps: true,
    collection: 'user_message',
    toJSON: { virtuals: true, versionKey: false }
})
export class Message {
    // @ApiProperty({ example: '1', description: 'Уникальный идентификатор сообщения' })
    // @Prop({ type: String, required: true })
    // msgId: string;

    // @ApiProperty({ example: '2', description: 'ID родительского сообщения, если это ответ' })
    // @Prop({ type: String, required: true })
    // parentMessage?: Message;

    @ApiProperty({ example: 'Привет, как дела?', description: 'Текст сообщения' })
    @Prop({ type: String, required: true })
    message: string;

    @ApiProperty({ example: '42', description: 'ID отправителя' })
    @Prop({ type: String, required: true })
    senderId: string;

    @ApiProperty({ example: '84', description: 'ID получателя' })
    @Prop({ type: String, required: true })
    receiverId: string;

    @ApiProperty({ example: false, description: 'Прочитано ли сообщение' })
    @Prop({ type: Boolean, required: true })
    read: boolean;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID диалога' })
    @Prop({ type: String, required: true })
    dialogId: string;

    @ApiProperty({ example: '2', description: 'ID родительского сообщения, если это ответ' })
    @Prop({ type: String, required: false, default: null })
    replyToMessageId: string | null;

    @ApiProperty({ example: '2', description: 'ID родительского сообщения, если это ответ' })
    @Prop({ type: [Object], required: false, default: [] })
    attachments: Attachment[];

    @ApiProperty({ example: [], description: 'Системная информация: кто удалил, когда и т.д.' })
    @Prop({ type: [Object], required: false, default: [] })
    meta: any[];

    @ApiProperty({ example: 'createdAt', description: 'Число создания сообщения.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления сообщения.' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления  сообщения.' })
    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createMessageInstance(dto: Omit<CreateMessageDomainDto, 'read' | 'meta' | 'attachments'>): MessageDocument {
        // console.log('TokenEntity: createTokenInstance - dto 😡 ', dto)
        const message = new this();
        const date = new Date();
        const createdAt = date.toISOString();

        message.message = dto.message;
        message.senderId = dto.senderId;
        message.receiverId = dto.receiverId;
        message.read = false;
        message.dialogId = dto.dialogId;
        message.meta = [];
        message.replyToMessageId = dto.replyToMessageId;
        message.attachments = []

        message.createdAt = createdAt;
        message.updatedAt = createdAt;
        message.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return message as MessageDocument;
    }
    updateMessage(dto: UpdateMessageDomainDto) {
        if (this.id === dto.msgId) {
            this.message = dto.message;
            this.senderId = dto.senderId;
            this.receiverId = dto.receiverId;
            this.read = this.read;
            this.dialogId = this.dialogId;
            this.meta = this.meta;
            this.replyToMessageId = dto.replyToMessageId;
            this.attachments = this.attachments;

            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt;
        }
    }
    updateRead(dto: UpdateMessageReadDomainDto) {
        if (this.id === dto.msgId) {
            this.message = this.message;
            this.senderId = this.senderId;
            this.receiverId = this.receiverId;
            this.read = dto.read;
            this.dialogId = this.dialogId;
            this.meta = this.meta;
            this.replyToMessageId = this.replyToMessageId;
            // message.attachments = dto.attachments;

            this.createdAt = this.createdAt;
            this.updatedAt = this.updatedAt;
            this.deletedAt = this.deletedAt;
        }
    }
    markMsgDeletedForUser(dto: UpdateMsgMetaDomainDto) {
        if (this.id === dto.msgId) {
            this.message = this.message;
            this.senderId = this.senderId;
            this.receiverId = this.receiverId;
            this.read = this.read;
            this.dialogId = this.dialogId;
            this.replyToMessageId = this.replyToMessageId;
            // message.attachments = dto.attachments;
            this.meta = dto.meta;

            this.createdAt = this.createdAt;
            this.updatedAt = this.updatedAt;
            this.deletedAt = this.deletedAt;
        }
    }
}
export const MessageSchema = SchemaFactory.createForClass(Message);
//регистрирует методы сущности в схеме
MessageSchema.loadClass(Message);
// Подключает виртуально BlogSchema в UserSchema
// MessageSchema.virtual('blogs', {
//     ref: 'Blog',
//     localField: '_id',
//     foreignField: 'blogId',
// });
//Типизация документа
export type MessageDocument = HydratedDocument<Message>;
//Типизация модели + статические методы
export type MessageModelType = Model<MessageDocument> & typeof Message;