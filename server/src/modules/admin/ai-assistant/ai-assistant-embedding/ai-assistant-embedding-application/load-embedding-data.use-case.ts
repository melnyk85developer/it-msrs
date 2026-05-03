import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateEmbeddingCommand } from "./create-embedding.use-case";

export class LoadEmbeddingDataCommand {
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

@CommandHandler(LoadEmbeddingDataCommand)
export class LoadEmbeddingDataUseCase implements ICommandHandler<LoadEmbeddingDataCommand> {

    constructor(private commandBus: CommandBus) { }

    async execute(command: LoadEmbeddingDataCommand) {
        const { assistantId, sourceType, sourceId, content, node } = command.dto;

        // 🔥 пока без сложного chunking
        const chunks = this.splitText(content);

        for (const chunk of chunks) {
            await this.commandBus.execute(
                new CreateEmbeddingCommand({
                    assistantId,
                    sourceType,
                    sourceId,
                    content: chunk,
                    node
                })
            );
        }

        return { success: true };
    }

    private splitText(text: string): string[] {
        const size = 500; // простой вариант
        const result: string[] = [];

        for (let i = 0; i < text.length; i += size) {
            result.push(text.slice(i, i + size));
        }

        return result;
    }
}