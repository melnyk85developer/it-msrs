import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { firstValueFrom } from "rxjs";

export class GetGoogleModelsQuery { }

type Model = {
    id: string;
    name: string;
    version: any;
};

@QueryHandler(GetGoogleModelsQuery)
export class GetGoogleModelsQueryUseCase implements IQueryHandler<GetGoogleModelsQuery> {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    async execute() {
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

        const { data } = await firstValueFrom(
            this.httpService.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
        );

        const FREE_MODELS = [
            'gemini-3.1-flash-lite-preview',
            'gemini-2.5-flash',
            'gemini-3-flash',
            'gemini-robotics-er-1.5-preview',
        ];

        const filtered: Model[] = data.models
            .filter((m: any) => m.supportedGenerationMethods.includes('generateContent'))
            .map((m: any) => ({
                id: m.name.split('/').pop(),
                name: m.displayName,
                version: m.version
            }));

        const paid: Model[] = [];
        const free: Model[] = [];

        for (const model of filtered) {
            if (FREE_MODELS.includes(model.id)) {
                free.push(model);
            } else {
                paid.push(model);
            }
        }
        // console.log('GetGoogleModelsQueryUseCase: 😡 - free ', free)
        return {
            paid,
            free
        };
    }
}