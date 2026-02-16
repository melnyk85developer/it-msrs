import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Token, type TokenModelType } from '../../tokens-domain/token-entity';
import { TokenRepository } from '../../tokens-infrastructure/token.repository';

export class SaveTokenBlackListCommand {
    constructor(
        public userId: string,
        public refreshToken: string
    ) { }
}

@CommandHandler(SaveTokenBlackListCommand)
export class SaveTokenBlackListUseCase
    implements ICommandHandler<SaveTokenBlackListCommand, string> {
    constructor(
        @InjectModel(Token.name) private tokenModel: TokenModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private tokenRepository: TokenRepository
    ) { }
    async execute(command: SaveTokenBlackListCommand): Promise<string> {
        const { userId, refreshToken } = command;
        // console.log('PostForProfileUseCase: - userId 😡 ', userId)
        // console.log('PostForProfileUseCase: - refreshToken 😡 ', refreshToken)
        const token = this.tokenModel.createTokenInstance(
            {
                userId: userId,
                refreshToken: refreshToken
            }
        )
        // console.log('TokenService: saveTokenBlackList - token 😡 ', token)
        await this.tokenRepository.save(token);
        return token._id.toString();
    }
}