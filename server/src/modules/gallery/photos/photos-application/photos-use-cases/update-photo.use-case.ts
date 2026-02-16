import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { UpdatePhotoDto } from "../../photos-dto/update-photo-dto";
import { PhotoRepository } from "../../photos-infrastructure/photos-repository";
import { GetOrCreatePhotoAlbumCommand } from "src/modules/gallery/photoAlbums/photo-album-application/photo-album-use-cases/get-photo-album-or-create.use-case";

export class UpdatePhotoCommand {
    constructor(
        public photoId: string,
        public readonly dto: UpdatePhotoDto,
        public image: Multer.File | null,
        public miniature: Multer.File | null
    ) { }
}
@CommandHandler(UpdatePhotoCommand)
export class UpdatePhotoUseCase
    implements ICommandHandler<UpdatePhotoCommand, string> {
    constructor(
        private commandBus: CommandBus,

        private photoRepository: PhotoRepository,
        private filesService: FilesService
    ) { }

    async execute(command: UpdatePhotoCommand) {
        const { photoId, image, dto, miniature } = command
        let isAlbum
        let newImageFileName
        let newMiniatureFileName

        // console.log('PhotoService: updatePhotoService - photoId, dto 😡 ', photoId, dto)
        const photo = await this.photoRepository.findPhotoByIdOrNotFoundFailRepository(photoId);

        if (image && miniature) {
            newImageFileName = await this.filesService.createPostFile(image);
            newMiniatureFileName = await this.filesService.createPostFile(miniature);
        }

        // isAlbum = await this.photoAlbumService.getPhotoAlbumNameOrCreatedService(dto.userId, dto.albumName, dto.miniatureName)

        isAlbum = await this.commandBus.execute<GetOrCreatePhotoAlbumCommand, string>(
            new GetOrCreatePhotoAlbumCommand(dto.userId, dto.albumName, dto.miniatureName)
        )

        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)
        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)

        photo.updatePhoto({
            photoId,
            userId: dto.userId,
            albumId: isAlbum.albumId,
            albumName: isAlbum.albumName,
            image: newImageFileName ? newImageFileName : dto.imageName,
            miniature: newMiniatureFileName ? newMiniatureFileName : dto.miniatureName
        });
        // console.log('PhotoService: updatePhotoService - photo1 😡 ', photo)
        await this.photoRepository.save(photo);
        // console.log('PhotoService: updatePhotoService - photo2 😡 ', photo)
        return photo._id.toString();
    }
}