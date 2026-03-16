import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { OllamaClusterService } from "../ai-assistant-infrastrucrure/ollama-cluster.service";

export class CheckAiClusterConnectionCommand {}

@CommandHandler(CheckAiClusterConnectionCommand)
export class CheckAiClusterConnectionUseCase implements ICommandHandler<CheckAiClusterConnectionCommand> {
    constructor(private readonly clusterService: OllamaClusterService) {}

    async execute() {
        return await this.clusterService.checkAllNodesStatus();
    }
}
