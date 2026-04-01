// get-all-providers-models.query.ts
import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetGoogleModelsQuery } from "./get-google-models.query.use-case";
import { GetOllamaLocalAiModelsQuery } from "./get-ollama-local-models.query.use-case";
import { GetOpenAiModelsQuery } from "./get-open-ai-models-query.use-case";

export class GetAllProvidersModelsQuery { }

@QueryHandler(GetAllProvidersModelsQuery)
export class GetAllProvidersModelsQueryUseCase
    implements IQueryHandler<GetAllProvidersModelsQuery> {

    constructor(private readonly queryBus: QueryBus) { }

    async execute(query: GetAllProvidersModelsQuery) {
        console.log('GetAllProvidersModelsQueryUseCase: all-terminators');
        const googleAI = this.queryBus.execute(new GetGoogleModelsQuery()).catch(() => [])
        const openAi = this.queryBus.execute(new GetOpenAiModelsQuery()).catch(() => [])
        const ollamaAILocal = this.queryBus.execute(new GetOllamaLocalAiModelsQuery()).catch(() => [])

        const [google, openai, ollama] = await Promise.all([
            googleAI,
            openAi,
            ollamaAILocal
        ]);

        return {
            google,
            openai,
            ollama
        };
    }
}