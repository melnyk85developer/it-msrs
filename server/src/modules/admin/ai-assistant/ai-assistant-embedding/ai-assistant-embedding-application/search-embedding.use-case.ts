import { Injectable } from '@nestjs/common';
import { EmbeddingRepository } from '../ai-assistant-embedding-infrastrucrure/embedding.repository';
import { GenerateEmbeddingUseCase } from './generate-embedding-use-case';

@Injectable()
export class SearchEmbeddingUseCase {
    constructor(
        private readonly embeddingRepository: EmbeddingRepository,
        private readonly generateEmbeddingUseCase: GenerateEmbeddingUseCase
    ) { }

    async execute(dto: {
        assistantId: string;
        query: string;
        node: string;
        limit?: number;
    }) {
        const { assistantId, query, node, limit = 5 } = dto;

        const queryVector = await this.generateEmbeddingUseCase.generateEmbedding(node, query);

        const allEmbeddings = await this.embeddingRepository.findByAssistantId(assistantId);

        const scored = allEmbeddings.map(e => ({
            content: e.content,
            score: this.cosineSimilarity(queryVector, e.vector)
        }));

        scored.sort((a, b) => b.score - a.score);

        return scored.slice(0, limit);
    }

    private cosineSimilarity(a: number[], b: number[]) {
        const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

        return dot / (magA * magB);
    }
}