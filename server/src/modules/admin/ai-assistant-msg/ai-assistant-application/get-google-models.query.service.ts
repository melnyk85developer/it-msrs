import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { firstValueFrom } from "rxjs";

export class GetGoogleModelsQuery { }

@QueryHandler(GetGoogleModelsQuery)
export class GetGoogleModelsHandler implements IQueryHandler<GetGoogleModelsQuery> {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    async execute() {
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
        const { data } = await firstValueFrom(
            this.httpService.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
        );

        // Фильтруем только те, что умеют генерировать контент (нам не нужны эмбеддинги и прочий хлам)
        return data.models
            .filter(m => m.supportedGenerationMethods.includes('generateContent'))
            .map(m => ({
                id: m.name.split('/').pop(), // префикс "models/" убираем
                name: m.displayName,
                version: m.version
            }));
    }
}