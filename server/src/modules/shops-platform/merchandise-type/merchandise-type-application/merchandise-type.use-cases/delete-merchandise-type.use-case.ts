import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MerchandiseTypeRepository } from "../../merchandise-type-infrastructure/merchandise-type.repository";


export class DeleteMerchandiseTypeCommand {
    constructor(
        public merchandiseId: string,
        public userId: string,
    ) { }
}
@CommandHandler(DeleteMerchandiseTypeCommand)
export class DeleteMerchandiseTypeUseCase
    implements ICommandHandler<DeleteMerchandiseTypeCommand, string> {
    constructor(
        private merchandiseTypeRepository: MerchandiseTypeRepository
    ) { }

    async execute(command: DeleteMerchandiseTypeCommand) {
        const { merchandiseId, userId } = command
        const merchandise = await this.merchandiseTypeRepository.findMerchandiseTypeByIdOrNotFoundFailRepository(merchandiseId);
        if (userId !== merchandise.userId) {
            // console.log('DeleteMerchandiseTypeUseCase: - merchandise 😡 userId !== merchandise.userId', merchandise)
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_SHOP_DELETE)
        }
        const isDeleteMerchandise = await this.merchandiseTypeRepository.deleteMerchandiseType(merchandiseId);
        // console.log('DeleteMerchandiseTypeUseCase: - isDeleteMerchandise 😡 ', isDeleteMerchandise)
        return isDeleteMerchandise._id
    }
}