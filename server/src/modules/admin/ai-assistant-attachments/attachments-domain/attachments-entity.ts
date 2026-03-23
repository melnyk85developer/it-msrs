import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreateAttachmentDomainDto } from "../attachments-dto/add-attachment-domain.dto";
import { UpdateAttachmentDto } from "../attachments-dto/update-attachment-domain.dto";
import { AiAssistantMessage } from "../../ai-assistant-msg/ai-assistant-domain/ai-assistant.entity";

@Schema({
    // timestamps: true,
    collection: 'dialog',
    toJSON: { virtuals: true, versionKey: false }
})
export class Attachment {
    @ApiProperty({ example: 1, description: 'ID сообщения, к которому привязано' })
    @Prop({ type: String, required: true })
    messageId: string;

    @ApiProperty({ example: 'http://…/file.jpg', description: 'URL вложения' })
    @Prop({ type: String, required: true })
    url: string;

    @ApiProperty({ example: 'image/jpeg', description: 'MIME-тип' })
    @Prop({ type: String, required: true })
    mimeType: string;

    @ApiProperty({ example: 'image/jpeg', description: 'MIME-тип' })
    @Prop({ type: String, required: true })
    message: AiAssistantMessage;

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

    static createAttachmentInstance(dto: CreateAttachmentDomainDto): AttachmentDocument {
        // console.log('TokenEntity: createTokenInstance - dto 😡 ', dto)
        const attachment = new this();
        const date = new Date();
        const createdAt = date.toISOString();

        attachment.messageId = dto.messageId;
        attachment.url = dto.url;
        attachment.mimeType = dto.mimeType
        attachment.createdAt = createdAt
        attachment.updatedAt = createdAt
        attachment.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return attachment as AttachmentDocument;
    }
    updateAttachment(dto: UpdateAttachmentDto) {
        if (this.id === dto.attachmentId) {
            this.url = dto.url;
            this.mimeType = dto.mimeType;
            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt;
        }
    }
}
export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
//регистрирует методы сущности в схеме
AttachmentSchema.loadClass(Attachment);
// // Подключает виртуально BlogSchema в UserSchema
// AttachmentSchema.virtual('blogs', {
//     ref: 'Blog',
//     localField: '_id',
//     foreignField: 'blogId',
// });
//Типизация документа
export type AttachmentDocument = HydratedDocument<Attachment>;
//Типизация модели + статические методы
export type AttachmentModelType = Model<AttachmentDocument> & typeof Attachment;