import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OllamaClusterService {
    private readonly logger = new Logger(OllamaClusterService.name);
    private readonly nodes: string[];

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        // Убедись, что в .env переменная AI_NODES — это JSON-строка массива или через запятую
        const nodesConfig = this.configService.get<any>('AI_NODES');
        this.nodes = Array.isArray(nodesConfig) ? nodesConfig : (nodesConfig?.split(',') || []);
        this.logger.log(`Initialized AI Cluster with nodes: ${this.nodes.join(', ')}`);
    }

    async sendToNode(nodeUrl: string, prompt: string) {
        try {
            this.logger.log(`Sending prompt to node: ${nodeUrl}`);
            const { data } = await firstValueFrom(
                this.httpService.post(`${nodeUrl}/api/generate`, {
                    model: 'gpt-oss', // Убедись, что эта модель скачана на ПК2/ПК3
                    prompt,
                    stream: false
                }, { timeout: 60000 }) // Таймаут 60 сек
            );
            return data.response;
        } catch (e) {
            this.logger.error(`Failed to reach node ${nodeUrl}: ${e.message}`);
            throw e;
        }
    }

    public getNodes(): string[] {
        return this.nodes;
    }
}
