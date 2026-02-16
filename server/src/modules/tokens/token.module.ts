import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './tokens-domain/token-entity';
import { TokenService } from './tokens-application/token-service';
import { TokenRepository } from './tokens-infrastructure/token.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SaveTokenBlackListUseCase } from './tokens-application/tokens-use-cases/save-token-black-list.use-case';
import { DeleteTokenBlackListUseCase } from './tokens-application/tokens-use-cases/delete-token-black-list.use-case';
import { CqrsModule } from '@nestjs/cqrs';

const useCases = [
    SaveTokenBlackListUseCase,
    DeleteTokenBlackListUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_ACCESS_SECRET'),
            }),
            inject: [ConfigService],
        }),
        CqrsModule,
    ],
    providers: [
        ...useCases,
        TokenService,
        TokenRepository,
    ],
    exports: [
        TokenService,
        TokenRepository,
    ],
})
export class TokenModule { }
