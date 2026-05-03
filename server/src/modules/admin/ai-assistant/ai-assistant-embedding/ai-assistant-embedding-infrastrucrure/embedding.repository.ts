import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Embedding, EmbeddingDocument, type EmbeddingModelType } from '../ai-assistant-embedding-domain/ai-assistant-embedding.entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Injectable()
export class EmbeddingRepository {
    constructor(
        @InjectModel(Embedding.name) private EmbeddingModel: EmbeddingModelType
    ) { }

    async save(embedding: EmbeddingDocument) {
        await embedding.save();
    }

    async findByAssistantId(assistantId: string): Promise<EmbeddingDocument[]> {
        return this.EmbeddingModel.find({ assistantId });
    }

    async deleteBySourceId(sourceId: string) {
        return this.EmbeddingModel.deleteMany({ sourceId });
    }

    async findAll(): Promise<EmbeddingDocument[]> {
        return this.EmbeddingModel.find();
    }

    async findByIdOrNotFoundFail(id: string): Promise<EmbeddingDocument> {
        if (!id || id === 'undefined') {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡');
        }

        const embedding = await this.EmbeddingModel.findById(new Types.ObjectId(id));

        if (!embedding) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND);
        }

        return embedding;
    }
    async getAllUniqueSources(): Promise<any[]> {
        return this.EmbeddingModel.aggregate([
            {
                $group: {
                    _id: "$sourceId", // Группируем по пути файла/ID источника
                    sourceType: { $first: "$sourceType" },
                    createdAt: { $first: "$createdAt" },
                    chunkCount: { $sum: 1 } // Считаем, на сколько кусков порезан файл
                }
            },
            { $project: { _id: 0, sourceId: "$_id", sourceType: 1, createdAt: 1, chunkCount: 1 } }
        ]);
    }
}