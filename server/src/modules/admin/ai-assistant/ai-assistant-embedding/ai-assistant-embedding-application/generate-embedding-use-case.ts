import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GenerateEmbeddingUseCase {
    constructor(private readonly httpService: HttpService) {}

    async generateEmbedding(nodeUrl: string, text: string, model = 'mxbai-embed-large'): Promise<number[]> {
        const { data } = await firstValueFrom(
            this.httpService.post(
                `${nodeUrl}/api/embeddings`,
                {
                    model,
                    prompt: text,
                },
                { timeout: 1000 * 60 }
            )
        );

        return data.embedding;
    }
}