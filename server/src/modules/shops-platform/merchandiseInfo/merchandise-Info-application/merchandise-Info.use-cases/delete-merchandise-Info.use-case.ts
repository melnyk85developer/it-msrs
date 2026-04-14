import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MerchandiseInfoRepository } from "../../merchandiseInfo-infrastructure/merchandise-Info.repository";

export class DeleteMerchandiseInfoCommand {
    constructor(
        public albumId: string,
    ) { }
}
@CommandHandler(DeleteMerchandiseInfoCommand)
export class DeleteMerchandiseInfoUseCase
    implements ICommandHandler<DeleteMerchandiseInfoCommand, string> {
    constructor(
        private merchandiseInfoRepository: MerchandiseInfoRepository
    ) { }

    async execute(command: DeleteMerchandiseInfoCommand) {
        const { albumId } = command
        const photoAlbum = await this.merchandiseInfoRepository.findMerchandiseInfoByIdOrNotFoundFailRepository(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        const isDeletedPhoto = await this.merchandiseInfoRepository.deleteMerchandiseInfo(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        // photoAlbum.makeDeletedPhotoAlbum();
        // await this.photoAlbumRepository.save(photoAlbum);
        return isDeletedPhoto._id
    }
}