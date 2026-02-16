import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { UsersRepository } from "../../users-infrastructure/users.repository";

export class UpdateLastSeenUserCommand {
    constructor(
        public userId: string
    ) { }
}
@CommandHandler(UpdateLastSeenUserCommand)
export class UpdateLastSeenUserUseCase
    implements ICommandHandler<UpdateLastSeenUserCommand, string> {
    constructor(
        private usersRepository: UsersRepository,
    ) { }

    async execute(command: UpdateLastSeenUserCommand) {
        const { userId } = command;
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        user.updateLastSeen(userId);
        await this.usersRepository.save(user);
        return user._id.toString();
    }
}