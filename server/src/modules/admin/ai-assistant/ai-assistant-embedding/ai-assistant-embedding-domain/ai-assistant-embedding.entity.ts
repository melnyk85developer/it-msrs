import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
    collection: 'ai_embedding',
    toJSON: { virtuals: true, versionKey: false }
})
export class Embedding {

    @ApiProperty({ example: 'assistantId', description: 'ID ассистента' })
    @Prop({ type: String, required: true })
    assistantId: string;

    @ApiProperty({ example: 'dialog', description: 'Тип источника (dialog/code/docs)' })
    @Prop({ type: String, required: true })
    sourceType: string;

    @ApiProperty({ example: 'messageId', description: 'ID источника' })
    @Prop({ type: String, required: true })
    sourceId: string;

    @ApiProperty({ example: 'text chunk', description: 'Контент чанка' })
    @Prop({ type: String, required: true })
    content: string;

    @ApiProperty({ example: '[0.123, 0.456]', description: 'Вектор embedding' })
    @Prop({ type: [Number], required: true })
    vector: number[];

    @ApiProperty({ example: 'module name', description: 'Модуль проекта' })
    @Prop({ type: String, required: false, default: null })
    module: string | null;

    @ApiProperty({ example: 'file path', description: 'Путь к файлу' })
    @Prop({ type: String, required: false, default: null })
    filePath: string | null;

    @ApiProperty({ example: ['tag1'], description: 'Теги' })
    @Prop({ type: [String], required: false, default: [] })
    tags: string[];

    @ApiProperty({ example: 'createdAt', description: 'Дата создания' })
    @Prop({ type: String, required: true })
    createdAt: string;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createEmbeddingInstance(dto: {
        assistantId: string;
        sourceType: string;
        sourceId: string;
        content: string;
        vector: number[];
        module?: string;
        filePath?: string;
        tags?: string[];
    }): EmbeddingDocument {
        const embedding = new this();
        const createdAt = new Date().toISOString();

        embedding.assistantId = dto.assistantId;
        embedding.sourceType = dto.sourceType;
        embedding.sourceId = dto.sourceId;
        embedding.content = dto.content;
        embedding.vector = dto.vector;
        embedding.module = dto.module || null;
        embedding.filePath = dto.filePath || null;
        embedding.tags = dto.tags || [];

        embedding.createdAt = createdAt;

        return embedding as EmbeddingDocument;
    }
}

export const EmbeddingSchema = SchemaFactory.createForClass(Embedding);
EmbeddingSchema.loadClass(Embedding);

export type EmbeddingDocument = HydratedDocument<Embedding>;
export type EmbeddingModelType = Model<EmbeddingDocument> & typeof Embedding;