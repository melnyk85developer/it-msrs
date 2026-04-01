import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { firstValueFrom } from "rxjs";

export class GetOpenAiModelsQuery { }

@QueryHandler(GetOpenAiModelsQuery)
export class GetOpenAiModelsQueryUseCase implements IQueryHandler<GetOpenAiModelsQuery> {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    async execute() {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');

        const { data } = await firstValueFrom(
            this.httpService.get('https://api.openai.com/v1/models', {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            })
        );

        const filtered = data.data
            .filter((m) => {
                const id = m.id;

                return (
                    (id.startsWith('gpt-') || id.startsWith('o')) &&
                    !id.includes('embedding') &&
                    !id.includes('audio') &&
                    !id.includes('realtime')
                );
            })
            .map(m => ({
                id: m.id,
                name: m.id,
                version: m.created
            }));

        return {
            paid: filtered,
            free: []
        };
    }
}