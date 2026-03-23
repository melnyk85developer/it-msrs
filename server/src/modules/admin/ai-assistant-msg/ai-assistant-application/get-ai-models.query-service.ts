// get-ai-models.query-service.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export class GetAiModelsQuery {}

type NodeModelsResult = {
    node: string;
    models: string[];
};

@QueryHandler(GetAiModelsQuery)
export class GetAiModelsQueryService implements IQueryHandler<GetAiModelsQuery> {
    private readonly logger = new Logger(GetAiModelsQueryService.name);
    private readonly nodes: string[];

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        const nodesConfig = this.configService.get<any>('AI_NODES');
        this.nodes = Array.isArray(nodesConfig)
            ? nodesConfig
            : (nodesConfig?.split(',') || []);
    }

    async execute(): Promise<NodeModelsResult[]> {
        const results: NodeModelsResult[] = [];

        for (const node of this.nodes) {
            try {
                const { data } = await firstValueFrom(
                    this.httpService.get(`${node}/api/tags`, {
                        timeout: 5000,
                    })
                );

                const models = (data.models || []).map((m: any) => m.name);

                results.push({
                    node,
                    models,
                });

            } catch (e) {
                this.logger.warn(`Failed to fetch models from ${node}`);
                results.push({
                    node,
                    models: [],
                });
            }
        }

        return results;
    }
}