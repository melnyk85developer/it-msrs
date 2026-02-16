import { UsersRepository } from '../../../user-accounts/users-infrastructure/users.repository';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TokenRepository } from '../../tokens-infrastructure/token.repository';

export class DeleteTokenBlackListCommand {
    constructor(
        public refreshToken: string
    ) { }
}

@CommandHandler(DeleteTokenBlackListCommand)
export class DeleteTokenBlackListUseCase
    implements ICommandHandler<DeleteTokenBlackListCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private tokenRepository: TokenRepository
    ) { }
    async execute(command: DeleteTokenBlackListCommand): Promise<string> {
        const { refreshToken } = command;
        const isToken = await this.tokenRepository.findTokenByTokenOrNotFoundFailRepository(refreshToken)
        // console.log('TokenService: deleteTokenBlackList - isToken 😡 ', isToken)

        const isDeletedToken = await this.tokenRepository.deleteTokenInBlackList(refreshToken)
        // console.log('TokenService: deleteTokenBlackList - isDeletedToken 😡 ', isDeletedToken)

        // const token = this.tokenModel.makeDeletedToken(refreshToken);

        await this.tokenRepository.save(isToken);
        return isToken._id.toString();
    }
}