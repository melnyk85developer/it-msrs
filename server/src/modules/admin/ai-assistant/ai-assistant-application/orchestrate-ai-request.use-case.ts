import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OllamaClusterService } from '../ai-assistant-infrastrucrure/ollama-cluster.service';

export class OrchestrateAiRequestCommand {
    constructor(public readonly prompt: string) { }
}

@CommandHandler(OrchestrateAiRequestCommand)
export class OrchestrateAiRequestUseCase implements ICommandHandler<OrchestrateAiRequestCommand> {
    constructor(private readonly clusterService: OllamaClusterService) { }

    async execute(command: OrchestrateAiRequestCommand) {
        const nodes = this.clusterService.getNodes();
        if (nodes.length === 0) throw new Error('No AI nodes configured');
        
        // Берем первый доступный URL из массива
        const targetNode = nodes[0];
        const response = await this.clusterService.sendToNode(targetNode, command.prompt);
        return { content: response }; 
    }
}

// @CommandHandler(OrchestrateAiRequestCommand)
// export class OrchestrateAiRequestUseCase implements ICommandHandler<OrchestrateAiRequestCommand> {
//     constructor(
//         private readonly clusterService: OllamaClusterService
//     ) { }

//     async execute(command: OrchestrateAiRequestCommand) {
//         const results = await Promise.all(
//             this.clusterService.getNodes().map(
//                 node => this.clusterService.sendToNode(node, command.prompt)
//             )
//         );
//         return { content: results.join('\n---\n') }; // Агрегация консилиума
//     }
// }
