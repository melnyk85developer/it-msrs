import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmbeddingRepository } from '../ai-assistant-embedding-infrastrucrure/embedding.repository';
import { GenerateEmbeddingUseCase } from './generate-embedding-use-case';
import { Embedding } from '../ai-assistant-embedding-domain/ai-assistant-embedding.entity';

export class CreateEmbeddingCommand {
    constructor(
        public readonly dto: {
            assistantId: string;
            sourceType: string;
            sourceId: string;
            content: string;
            node: string;
        }
    ) { }
}

@CommandHandler(CreateEmbeddingCommand)
export class CreateEmbeddingUseCase implements ICommandHandler<CreateEmbeddingCommand> {
    constructor(
        private readonly embeddingRepository: EmbeddingRepository,
        private readonly generateEmbeddingUseCase: GenerateEmbeddingUseCase
    ) { }

    async execute(command: CreateEmbeddingCommand) {
        const { assistantId, sourceType, sourceId, content, node } = command.dto;

        const vector = await this.generateEmbeddingUseCase.generateEmbedding(node, content);

        const embedding = Embedding.createEmbeddingInstance({
            assistantId,
            sourceType,
            sourceId,
            content,
            vector
        });

        await this.embeddingRepository.save(embedding);

        return embedding;
    }
}