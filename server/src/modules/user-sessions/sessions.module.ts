import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './sessions-domain/sessions.entity';
import { SessionsRepository } from './sessions-infrastructure/session.repository';
import { TokenModule } from '../tokens/token.module';
import { SessionController } from './sessions-api/sessions.controller';
import { SessionQueryRepository } from './sessions-infrastructure/sessions.query-repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateSessionUseCase } from './sessions-application/sessions-use-cases/create-session.use-case';
import { UpdateSessionUseCase } from './sessions-application/sessions-use-cases/update-session.use-case';
import { DeleteSessionUseCase } from './sessions-application/sessions-use-cases/delete-session.use-case';
import { DeleteAllSessionUseCase } from './sessions-application/sessions-use-cases/delete-all-sessions.use-case';

const useCases = [
    CreateSessionUseCase,
    UpdateSessionUseCase,
    DeleteSessionUseCase,
    DeleteAllSessionUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
        TokenModule,
        CqrsModule,
    ],
    controllers: [SessionController],
    providers: [
        ...useCases,
        SessionsRepository,
        SessionQueryRepository,
    ],
    exports: [
        SessionsRepository,
        SessionQueryRepository,
    ],
})
export class SessionModule { }
