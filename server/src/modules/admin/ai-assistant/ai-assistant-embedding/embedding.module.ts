import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Embedding, EmbeddingSchema } from './ai-assistant-embedding-domain/ai-assistant-embedding.entity';
import { EmbeddingRepository } from './ai-assistant-embedding-infrastrucrure/embedding.repository';
import { SearchEmbeddingUseCase } from './ai-assistant-embedding-application/search-embedding.use-case';
import { GenerateEmbeddingUseCase } from './ai-assistant-embedding-application/generate-embedding-use-case';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Embedding.name,
                schema: EmbeddingSchema,
            },
        ]),
        HttpModule
    ],
    providers: [
        EmbeddingRepository,
        GenerateEmbeddingUseCase,
        SearchEmbeddingUseCase,
    ],
    exports: [
        EmbeddingRepository,
        GenerateEmbeddingUseCase,
        SearchEmbeddingUseCase,
    ],
})
export class EmbeddingModule { }