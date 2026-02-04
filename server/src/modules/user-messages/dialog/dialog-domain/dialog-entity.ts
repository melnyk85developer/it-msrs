import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { Message } from "../../msg/msg-domain/msg-entity";
import { CreateDialogDomainDto } from "../dialog-dto/create-dialog-domain.dto";
import { UpdateDialogDto } from "../dialog-dto/update-dialog-domain.dto";

@Schema({
    // timestamps: true,
    collection: 'dialog',
    toJSON: { virtuals: true, versionKey: false }
})
export class Dialog {
    @ApiProperty({ example: '811192811811192811', description: 'Уникальный идентификатор отправителя' })
    @Prop({ type: String, required: true })
    userAId: string;

    @ApiProperty({ example: '811192811811192811', description: 'Уникальный идентификатор получателя' })
    @Prop({ type: String, required: true })
    userBId: string;

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

    static createDialogInstance(dto: CreateDialogDomainDto): DialogDocument {
        // console.log('TokenEntity: createTokenInstance - dto 😡 ', dto)
        const dialog = new this();

        dialog.userAId = dto.userAId;
        dialog.userBId = dto.userBId;

        dialog.createdAt = new Date().toISOString();
        dialog.updatedAt = new Date().toISOString();
        dialog.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return dialog as DialogDocument;
    }
    updateMarkDialogDeleted(dialogId: string, userId: string) {
        if (this.id === dialogId) {
            this.userAId = this.userAId;
            this.userBId = this.userBId;
            this.meta = this.meta.map(m => m.userId !== userId);
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt;
        }
    }
    markDialogDeletedForUser(dialogId: string, userId: string) {
        if (this.id === dialogId) {
            this.meta = [...this.meta, { userId: userId, deletedAt: new Date().toISOString() }];
            // message.attachments = dto.attachments;
            this.createdAt = this.createdAt;
            this.updatedAt = this.updatedAt;
            this.deletedAt = this.deletedAt;
        }
    }
}
export const DialogSchema = SchemaFactory.createForClass(Dialog);
//регистрирует методы сущности в схеме
DialogSchema.loadClass(Dialog);
// // Подключает виртуально BlogSchema в UserSchema
// DialogSchema.virtual('blogs', {
//     ref: 'Blog',
//     localField: '_id',
//     foreignField: 'blogId',
// });
//Типизация документа
export type DialogDocument = HydratedDocument<Dialog>;
//Типизация модели + статические методы
export type DialogModelType = Model<DialogDocument> & typeof Dialog;