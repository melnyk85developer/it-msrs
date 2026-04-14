import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MerchandiseTypeRepository } from "../../merchandise-type-infrastructure/merchandise-type.repository";


export class DeleteMerchandiseTypeCommand {
    constructor(
        public albumId: string,
    ) { }
}
@CommandHandler(DeleteMerchandiseTypeCommand)
export class DeleteMerchandiseTypeUseCase
    implements ICommandHandler<DeleteMerchandiseTypeCommand, string> {
    constructor(
        private merchandiseTypeRepository: MerchandiseTypeRepository
    ) { }

    async execute(command: DeleteMerchandiseTypeCommand) {
        const { albumId } = command
        const photoAlbum = await this.merchandiseTypeRepository.findMerchandiseTypeByIdOrNotFoundFailRepository(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        const isDeletedPhoto = await this.merchandiseTypeRepository.deleteMerchandiseType(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        // photoAlbum.makeDeletedPhotoAlbum();
        // await this.photoAlbumRepository.save(photoAlbum);
        return isDeletedPhoto._id
    }
}