import { DomainException } from "src/core/exceptions/domain-exceptions";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from "src/modules/user-accounts/users-dto/create-user.dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GlobalRateLimitRepository } from "src/request-limit/request-limit-infrastructure/request-limit.repository";
import { GlobalRateLimit, type GlobalRateLimitModelType } from "src/request-limit/request-limit-domain/request-limit.entity";
import { RequestLimitDto } from "src/request-limit/request-limit-dto/request-limit.dto";

export class GlobalRateLimitCommand {
    constructor(
        public readonly dto: Omit<RequestLimitDto, 'createdAt' | 'updatedAt' | 'deletedAt'>,
    ) { }
}
@CommandHandler(GlobalRateLimitCommand)
export class GlobalRateLimitUseCase
    implements ICommandHandler<GlobalRateLimitCommand, string> {
    constructor(
        @InjectModel(GlobalRateLimit.name) private GlobalRateLimitModel: GlobalRateLimitModelType,
        private globalRateLimitRepository: GlobalRateLimitRepository,
    ) { }

    async execute(command: GlobalRateLimitCommand) {
        const { IP, URL, date } = command.dto;
        const { dto } = command

        console.log('GlobalRateLimitUseCase - IP, URL, date 👽 😡 👽', IP, URL, date)

        const limit = await this.GlobalRateLimitModel.createGlobalRateLimitInstance(dto);
        // console.log('GlobalRateLimitUseCase - limit 😡 ', limit)
        await this.globalRateLimitRepository.saveLimit(limit);
        // console.log('GlobalRateLimitUseCase - limit._id.toString() 😡 ', limit._id.toString())
        return limit._id.toString();
    }
}