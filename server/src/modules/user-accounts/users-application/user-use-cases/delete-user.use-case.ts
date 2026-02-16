import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { UsersRepository } from "../../users-infrastructure/users.repository";

export class DeleteUserCommand {
    constructor(
        public id: string
    ) { }
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
    implements ICommandHandler<DeleteUserCommand, void> {
    constructor(
        private usersRepository: UsersRepository,
    ) { }

    async execute(command: DeleteUserCommand) {
        const { id } = command;
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(id);
        // console.log('UsersService: deleteUserService - user 😡 ', user)
        user.makeDeletedAccount();
        await this.usersRepository.save(user);
    }
}