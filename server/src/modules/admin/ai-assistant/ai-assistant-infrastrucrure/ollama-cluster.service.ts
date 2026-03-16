import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OllamaClusterService {
    private readonly nodes: string[];

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService

    ) {
        // Добавляем fallback на пустой массив, если переменная не задана
        this.nodes = this.configService.get<string[]>('AI_NODES') || [];
    }
    async sendToNode(nodeIndex: string, prompt: string) {
        const nodeUrl = this.nodes[nodeIndex];
        const { data } = await firstValueFrom(
            this.httpService.post(`${nodeUrl}/api/generate`, {
                model: 'gpt-oss',
                prompt,
                stream: false
            })
        );
        return data.response;
    }
    async healthCheck(nodeIndex: number): Promise<boolean> {
        const nodeUrl = this.nodes[nodeIndex];
        try {
            // Простой GET-запрос к корню Ollama
            await firstValueFrom(this.httpService.get(nodeUrl));
            return true;
        } catch (e) {
            return false;
        }
    }
    // Добавляем публичный метод для получения списка
    public getNodes(): string[] {
        return this.nodes;
    }
    async checkAllNodesStatus() {
        return await Promise.all(
            this.getNodes().map(async (url) => {
                try {
                    const { data } = await firstValueFrom(this.httpService.get(`${url}/api/tags`));
                    return { url, status: 'online', modelsCount: data.models.length };
                } catch {
                    return { url, status: 'offline' };
                }
            })
        );
    }
}