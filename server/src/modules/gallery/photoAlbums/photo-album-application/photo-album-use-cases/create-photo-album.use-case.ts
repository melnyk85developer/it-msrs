import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { PhotoAlbumRepository } from "../../photo-album-infrastructure/photo-album.repository";
import { CreateAlbumDto } from "../../photo-album-dto/create-album-dto";
import { InjectModel } from "@nestjs/mongoose";
import { PhotoAlbum, type PhotoAlbumModelType } from "../../photo-album-domain/photo-album-entity";

export class CreatePhotoAlbumCommand {
    constructor(
        public userId: string,
        public albumCoverFile: Multer.File | null,
        public readonly dto: Omit<CreateAlbumDto, 'userId'>
    ) { }
}
@CommandHandler(CreatePhotoAlbumCommand)
export class CreatePhotoAlbumUseCase
    implements ICommandHandler<CreatePhotoAlbumCommand, string> {
    constructor(
        @InjectModel(PhotoAlbum.name) private photoAlbumModel: PhotoAlbumModelType,
        private photoAlbumRepository: PhotoAlbumRepository,
        private filesService: FilesService,
    ) { }

    async execute(command: CreatePhotoAlbumCommand) {
        const { albumCoverFile, dto, userId } = command
        // console.log('CreatePhotoAlbumUseCase: - dto 😡 1', dto)
        // console.log('CreatePhotoAlbumUseCase: - albumCoverFile 😡 2', albumCoverFile)
        let isAlbum
        let imageName = albumCoverFile ? await this.filesService.createAvatarFile(albumCoverFile) : null;

        if (dto.albumName === 'defaultAlbum') {
            // console.log('CreatePhotoAlbumUseCase: - albumName 😡 3', dto.albumName)
            isAlbum = await this.photoAlbumRepository.findPhotoAlbumByName(userId, 'defaultAlbum');

        }
        if (dto.albumName !== 'defaultAlbum') {
            // console.log('CreatePhotoAlbumUseCase: - albumName 😡 4', dto.albumName)
            isAlbum = await this.photoAlbumRepository.findPhotoAlbumByName(userId, dto.albumName);
        }
        if (!isAlbum) {
            const photoAlbum = this.photoAlbumModel.createPhotoAlbumInstance(
                {
                    albumName: dto.albumName,
                    albumCoverName: imageName ? imageName : null,
                    userId
                }
            )
            // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 save', photoAlbum)
            await this.photoAlbumRepository.save(photoAlbum);
            // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 res', photoAlbum)
            return photoAlbum._id.toString();
        } else {
            return isAlbum._id.toString();
        }
    }
}