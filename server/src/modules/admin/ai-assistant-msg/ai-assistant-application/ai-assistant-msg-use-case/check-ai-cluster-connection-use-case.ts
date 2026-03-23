import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MessageAiAssistantQueryService } from "../msg-ai-assistant-query-service";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

export class CheckAiClusterConnectionCommand { }

@CommandHandler(CheckAiClusterConnectionCommand)
export class CheckAiClusterConnectionUseCase implements ICommandHandler<CheckAiClusterConnectionCommand> {
    private readonly logger = new Logger(CheckAiClusterConnectionUseCase.name);
    private readonly nodes: string[];

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        const nodesConfig = this.configService.get<any>('AI_NODES');
        this.nodes = Array.isArray(nodesConfig) ? nodesConfig : (nodesConfig?.split(',') || []);
        this.logger.log(`Initialized AI Cluster with nodes: ${this.nodes.join(', ')}`);
    }

    async execute() {
        console.log('CheckAiClusterConnectionUseCase: - 😡')
        return await this.checkAllNodesStatus();
    }

    async checkNode(nodeUrl: string): Promise<boolean> {
        console.log('checkNode: - 😡 req: nodeUrl', nodeUrl)

        try {
            await firstValueFrom(
                this.httpService.get(`${nodeUrl}/api/tags`, { timeout: 3000 })
            );
            console.log('checkNode: - 😡 res: true')
            return true;
        } catch (error) {
            console.error('checkNode error: ', error)
            return false;
        }
    }
    async checkAllNodesStatus() {
        console.log('checkAllNodesStatus: - 😡 req')
        const results = await Promise.all(
            this.nodes.map(async (node) => ({
                node,
                isAlive: await this.checkNode(node),
            }))
        );
        console.log('checkAllNodesStatus: - 😡 res: results', results)
        return results;
    }
    public getNodes(): string[] {
        return this.nodes;
    }
}