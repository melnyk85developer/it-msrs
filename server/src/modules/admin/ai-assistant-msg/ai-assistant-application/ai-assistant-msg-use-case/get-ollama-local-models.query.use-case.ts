// get-ai-models.query-service.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

type Model = {
    id: string;
    name: string;
    version: string;
};

type NodeResult = {
    localPC: {
        name: string;
        node: string;
    };
    paid: Model[];
    free: Model[];
};

export class GetOllamaLocalAiModelsQuery { }

@QueryHandler(GetOllamaLocalAiModelsQuery)
export class GetOllamaLocalAiModelsQueryUseCase implements IQueryHandler<GetOllamaLocalAiModelsQuery> {
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

    async execute(): Promise<NodeResult[]> {
        const results: NodeResult[] = [];

        let index = 1;

        for (const node of this.nodes) {
            try {
                const { data } = await firstValueFrom(
                    this.httpService.get(`${node}/api/tags`, { timeout: 5000 })
                );

                const models: Model[] = (data.models || [])
                    .map((m: any) => m.name)
                    .filter((name: string) =>
                        !name.includes('embed') &&
                        !name.includes('safeguard')
                    )
                    .map((name: string) => {
                        const [id, version = 'latest'] = name.split(':');

                        return {
                            id,
                            name: id,
                            version
                        };
                    });

                results.push({
                    localPC: {
                        name: `ПК${index++}`,
                        node
                    },
                    paid: [],
                    free: models
                });

            } catch {
                results.push({
                    localPC: {
                        name: `ПК${index++}`,
                        node
                    },
                    paid: [],
                    free: []
                });
            }
        }

        return results;
    }
}