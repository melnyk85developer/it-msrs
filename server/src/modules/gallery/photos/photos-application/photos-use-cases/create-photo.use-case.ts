import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { InjectModel } from "@nestjs/mongoose";
import { PhotoRepository } from "../../photos-infrastructure/photos-repository";
import { CreatePhotoDto } from "../../photos-dto/create-photo-dto";
import { GetOrCreatePhotoAlbumCommand } from "src/modules/gallery/photoAlbums/photo-album-application/photo-album-use-cases/get-photo-album-or-create.use-case";
import { Photo, type PhotoModelType } from "../../photos-domain/photos-entity";

export class CreatePhotoCommand {
    constructor(
        public userId: string,
        public readonly dto: CreatePhotoDto,
        public image: Multer.File | null,
        public miniature: Multer.File | null
    ) { }
}
@CommandHandler(CreatePhotoCommand)
export class CreatePhotoUseCase
    implements ICommandHandler<CreatePhotoCommand, string> {
    constructor(
        @InjectModel(Photo.name) private photoModel: PhotoModelType,
        private commandBus: CommandBus,
        private photoRepository: PhotoRepository,
        private filesService: FilesService,
    ) { }

    async execute(command: CreatePhotoCommand) {
        const { image, miniature, dto, userId } = command
        // console.log('createPhotoService - userId 😡 1', userId)
        // console.log('createPhotoService - dto 😡 2', dto.albumName)
        let isAlbum

        const imageName = await this.filesService.createPostFile(image);
        const miniatureName = await this.filesService.createPostFile(miniature);
        // console.log('createPhotoService - imageName 😡 3', imageName)
        // console.log('createPhotoService - miniatureName 😡 4', miniatureName)

        // isAlbum = await this.photoAlbumService.getPhotoAlbumNameOrCreatedService(userId, dto.albumName, miniatureName)
        isAlbum = await this.commandBus.execute<GetOrCreatePhotoAlbumCommand, string>(
            new GetOrCreatePhotoAlbumCommand(userId, dto.albumName, miniatureName)
        )

        // console.log('PhotoAlbumService: IS createPhotoAlbumService - isAlbum 😡 10', isAlbum)

        const photo = this.photoModel.createPhotoInstance({
            ...dto,
            image: imageName,
            miniature: miniatureName,
            albumName: isAlbum.albumName,
            albumId: isAlbum._id,
            userId: userId
        });
        // console.log('PhotoAlbumService: IS createPhotoInstance - photo 😡 11', photo)
        await this.photoRepository.save(photo);
        // console.log('PhotoAlbumService: IS createPhotoAlbumService - isAlbum 😡 12', photo)
        return photo._id.toString();
    }
}