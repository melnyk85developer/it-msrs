import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MerchandiseBrandRepository } from "../../merchandise-brand-infrastructure/merchandise-brand.repository";

export class DeleteMerchandiseBrandCommand {
    constructor(
        public albumId: string,
    ) { }
}
@CommandHandler(DeleteMerchandiseBrandCommand)
export class DeleteMerchandiseBrandUseCase
    implements ICommandHandler<DeleteMerchandiseBrandCommand, string> {
    constructor(
        private merchandiseBrandRepository: MerchandiseBrandRepository
    ) { }

    async execute(command: DeleteMerchandiseBrandCommand) {
        const { albumId } = command
        const photoAlbum = await this.merchandiseBrandRepository.findMerchandiseBrandByIdOrNotFoundFailRepository(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        const isDeletedPhoto = await this.merchandiseBrandRepository.deleteMerchandiseBrand(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        // photoAlbum.makeDeletedPhotoAlbum();
        // await this.photoAlbumRepository.save(photoAlbum);
        return isDeletedPhoto._id
    }
}