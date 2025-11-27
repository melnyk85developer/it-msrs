import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './token-entity';
import { TokenService } from './token-service';
import { TokenRepository } from './token.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    ],
    providers: [
        TokenService,
        TokenRepository,
    ],
    exports: [
        TokenService,
        TokenRepository,
    ],
})
export class TokenModule { }
