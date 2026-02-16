import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { PhotoAlbumRepository } from "../../photo-album-infrastructure/photo-album.repository";

export class DeletePhotoAlbumCommand {
    constructor(
        public albumId: string,
    ) { }
}
@CommandHandler(DeletePhotoAlbumCommand)
export class DeletePhotoAlbumUseCase
    implements ICommandHandler<DeletePhotoAlbumCommand, string> {
    constructor(
        private photoAlbumRepository: PhotoAlbumRepository
    ) { }

    async execute(command: DeletePhotoAlbumCommand) {
        const { albumId } = command
        const photoAlbum = await this.photoAlbumRepository.findPhotoAlbumByIdOrNotFoundFailRepository(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        const isDeletedPhoto = await this.photoAlbumRepository.deletePhotoAlbum(albumId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        // photoAlbum.makeDeletedPhotoAlbum();
        // await this.photoAlbumRepository.save(photoAlbum);
        return isDeletedPhoto._id
    }
}