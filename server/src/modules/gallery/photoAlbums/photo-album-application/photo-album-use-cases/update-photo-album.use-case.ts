import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { PhotoAlbumRepository } from "../../photo-album-infrastructure/photo-album.repository";
import { UpdatePhotoAlbumDto } from "../../photo-album-dto/update-photo-album-dto";

export class UpdatePhotoAlbumCommand {
    constructor(
        public albumId: string,
        public readonly dto: Omit<UpdatePhotoAlbumDto, 'albumId'>,
        public albumCoverFile: Multer.File | null,
    ) { }
}
@CommandHandler(UpdatePhotoAlbumCommand)
export class UpdatePhotoAlbumUseCase
    implements ICommandHandler<UpdatePhotoAlbumCommand, string> {
    constructor(
        private photoAlbumRepository: PhotoAlbumRepository,
        private filesService: FilesService
    ) { }

    async execute(command: UpdatePhotoAlbumCommand) {
        const { albumCoverFile, dto, albumId } = command
        let newImageFileName
        // console.log('PhotoAlbumService: updatePhotoAlbumService - albumId, dto 😡 ', albumId, dto)
        const photoAlbum = await this.photoAlbumRepository.findPhotoAlbumByIdOrNotFoundFailRepository(albumId);
        if (albumCoverFile) {
            newImageFileName = await this.filesService.createPostFile(albumCoverFile);
        }
        // console.log('PhotoAlbumService: updatePhotoAlbumService - newImageFileName 😡 ', newImageFileName)
        photoAlbum.updatePhotoAlbum({
            ...dto,
            albumId,
            albumCoverName: newImageFileName ? newImageFileName : dto.albumCoverName ? dto.albumCoverName : null
        });
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo1 😡 ', photo)
        await this.photoAlbumRepository.save(photoAlbum);
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo2 😡 ', photo)
        return photoAlbum._id.toString();
    }
}