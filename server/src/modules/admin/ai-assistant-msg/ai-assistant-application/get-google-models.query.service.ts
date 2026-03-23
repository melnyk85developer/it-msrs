import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { firstValueFrom } from "rxjs";

export class GetGoogleModelsQuery { }

@QueryHandler(GetGoogleModelsQuery)
export class GetGoogleModelsQueryHandler
    implements IQueryHandler<GetGoogleModelsQuery> {

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async execute() {
        const googleModels = await this.getGoogleModelsInternal();

        return {
            google: googleModels,
            // потом добавишь:
            // openai
            // ollama
        };
    }

    private async getGoogleModelsInternal() {
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

        const { data } = await firstValueFrom(
            this.httpService.get(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
            )
        );

        return data.models;
    }
}