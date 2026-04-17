import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MerchandiseBrandRepository } from "../../merchandise-brand-infrastructure/merchandise-brand.repository";

export class DeleteMerchandiseBrandCommand {
    constructor(
        public brandId: string,
        public userId: string,
    ) { }
}
@CommandHandler(DeleteMerchandiseBrandCommand)
export class DeleteMerchandiseBrandUseCase
    implements ICommandHandler<DeleteMerchandiseBrandCommand, string> {
    constructor(
        private merchandiseBrandRepository: MerchandiseBrandRepository
    ) { }

    async execute(command: DeleteMerchandiseBrandCommand) {
        const { brandId, userId } = command
        const brand = await this.merchandiseBrandRepository.findMerchandiseBrandByIdOrNotFoundFailRepository(brandId);
        if (userId !== brand.userId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_MERCHANDISE_BRAND_UPDATE)
        }
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        const isDeletedPhoto = await this.merchandiseBrandRepository.deleteMerchandiseBrand(brandId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        return isDeletedPhoto._id
    }
}