import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAllRulesAiAssistantDomainDto } from '../ai-assistant-dto/create-all-rules-for-ai-assistants-domain.dto';
import { UpdateRulesAiAssistantDomainDto } from '../ai-assistant-dto/update-all-rules-for-ai-assistants-domain.dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Schema({
    // _id: false,
    // timestamps: true, 
    collection: 'ai_assistant_global_context',
    toJSON: { virtuals: true }
})
export class RulesAiAssistant {
    @ApiProperty({ example: 'titleRules', description: 'Заголовок системных настроек ассистента.' })
    @Prop({ type: String, required: false })
    titleRules: string;

    @ApiProperty({ example: 'contentRules', description: 'Глобальные настройки контекста ассистента.' })
    @Prop({ type: String, required: false })
    contentRules: string;

    @ApiProperty({ example: 'createdAt', description: 'Число создания аккаунта.' })
    @Prop({ type: String, required: false })
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

    static createRulesAiAssistantInstance(dto: CreateAllRulesAiAssistantDomainDto): RulesAiAssistantDocument {
        // console.log('AiAssistantMessageEntity: createAiAssistantMessageInstance - dto 😡 ', dto)
        const rules = new this();
        const date = new Date();
        const createdAt = date.toISOString();

        rules.titleRules = dto.titleRules;
        rules.contentRules = dto.contentRules;

        // rules.globalRules = dto.globalRules;
        // rules.currentMission = dto.currentMission;
        // rules.projectContext = dto.projectContext;
        // rules.employmentContext = dto.employmentContext;

        rules.createdAt = createdAt;
        rules.updatedAt = createdAt;
        rules.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return rules as RulesAiAssistantDocument;
    }
    updateAiAssistantMessage(dto: UpdateRulesAiAssistantDomainDto) {
        if (this.id === dto.id) {
            this.titleRules = dto.titleRules;
            this.contentRules = dto.contentRules;
            // this.currentMission = dto.currentMission;
            // this.projectContext = dto.projectContext;
            // this.employmentContext = dto.employmentContext;

            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt;
        }
    }
    markMsgDeletedForUser(id: string) {
        if (this.id === id) {
            this.titleRules = this.titleRules;
            // this.currentMission = this.currentMission;
            // this.projectContext = this.projectContext;
            // this.employmentContext = this.employmentContext;

            this.createdAt = this.createdAt;
            this.updatedAt = this.updatedAt;
            this.deletedAt = this.deletedAt;
        }
    }
}
export const RulesAiAssistantSchema = SchemaFactory.createForClass(RulesAiAssistant);
//регистрирует методы сущности в схеме
RulesAiAssistantSchema.loadClass(RulesAiAssistant);
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
export type RulesAiAssistantDocument = HydratedDocument<RulesAiAssistant>;
//Типизация модели + статические методы
export type RulesAiAssistantModelType = Model<RulesAiAssistantDocument> & typeof RulesAiAssistant;