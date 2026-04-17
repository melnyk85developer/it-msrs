import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MerchandiseRepository } from "../../merchandise-infrastructure/merchandise.repository";

export class DeleteMerchandiseCommand {
    constructor(
        public merchandiseId: string,
        public userId: string,
    ) { }
}
@CommandHandler(DeleteMerchandiseCommand)
export class DeleteMerchandiseUseCase
    implements ICommandHandler<DeleteMerchandiseCommand, string> {
    constructor(
        private merchandiseRepository: MerchandiseRepository
    ) { }

    async execute(command: DeleteMerchandiseCommand) {
        const { merchandiseId, userId } = command
        const merchandise = await this.merchandiseRepository.findMerchandiseByIdOrNotFoundFailRepository(merchandiseId);
        // console.log('DeleteMerchandiseUseCase: - merchandise 😡 ', merchandise)
        if (userId !== merchandise.userId) {
            // console.log('DeleteMerchandiseUseCase: - merchandiseType 😡 userId !== merchandiseType.userId', merchandiseType)
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_MERCHANDISE_DELETE)
        }
        const isDeletedPhoto = await this.merchandiseRepository.deletePhotoAlbum(merchandiseId);
        // console.log('DeleteMerchandiseUseCase: - merchandise 😡 ', merchandise)
        return isDeletedPhoto._id
    }
}