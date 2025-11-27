import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './sessions-domain/sessions.entity';
import { SessionService } from './sessions-application/sessions.service';
import { SessionsRepository } from './sessions-infrastructure/session.repository';
import { TokenModule } from '../tokens/token.module';
import { SessionController } from './sessions-api/sessions.controller';
import { SessionQueryRepository } from './sessions-infrastructure/sessions.query-repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
        TokenModule,
    ],
    controllers: [SessionController],
    providers: [
        SessionService,
        SessionsRepository,
        SessionQueryRepository,
    ],
    exports: [
        SessionService,
        SessionsRepository,
        SessionQueryRepository,
    ],
})
export class SessionModule { }
