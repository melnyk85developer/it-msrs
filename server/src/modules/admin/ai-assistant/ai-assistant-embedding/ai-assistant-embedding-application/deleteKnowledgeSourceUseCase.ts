import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EmbeddingRepository } from "../ai-assistant-embedding-infrastrucrure/embedding.repository";
import { ConfigService } from "@nestjs/config";
import * as fs from 'fs/promises';
import * as path from 'path';

export class DeleteKnowledgeSourceCommand {
    constructor(public readonly sourceId: string) { }
}

@CommandHandler(DeleteKnowledgeSourceCommand)
export class DeleteKnowledgeSourceUseCase implements ICommandHandler<DeleteKnowledgeSourceCommand> {
    constructor(
        private readonly embeddingRepository: EmbeddingRepository,
        // private readonly configService: ConfigService // оставь, если нужен для других целей
    ) { }

    async execute(command: DeleteKnowledgeSourceCommand) {
        const { sourceId } = command;

        // 1. Удаляем из БД (все чанки этого файла)
        await this.embeddingRepository.deleteBySourceId(sourceId);

        // 2. Удаляем физический файл асинхронно
        const fullPath = path.resolve(process.cwd(), 'static', sourceId);
        
        try {
            await fs.unlink(fullPath);
        } catch (error) {
            // Игнорируем ошибку, если файла физически уже нет на диске
        }

        return { success: true };
    }
}