import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MerchandiseRepository } from "../../merchandise-infrastructure/merchandise.repository";

export class DeleteMerchandiseCommand {
    constructor(
        public albumId: string,
    ) { }
}
@CommandHandler(DeleteMerchandiseCommand)
export class DeleteMerchandiseUseCase
    implements ICommandHandler<DeleteMerchandiseCommand, string> {
    constructor(
        private photoAlbumRepository: MerchandiseRepository
    ) { }

    async execute(command: DeleteMerchandiseCommand) {
        const { albumId } = command
        const photoAlbum = await this.photoAlbumRepository.findMerchandiseByIdOrNotFoundFailRepository(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        const isDeletedPhoto = await this.photoAlbumRepository.deletePhotoAlbum(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        // photoAlbum.makeDeletedPhotoAlbum();
        // await this.photoAlbumRepository.save(photoAlbum);
        return isDeletedPhoto._id
    }
}