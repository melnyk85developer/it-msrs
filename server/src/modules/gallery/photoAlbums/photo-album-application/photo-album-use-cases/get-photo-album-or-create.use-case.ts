import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { PhotoAlbumRepository } from "../../photo-album-infrastructure/photo-album.repository";
import { InjectModel } from "@nestjs/mongoose";
import { PhotoAlbum, type PhotoAlbumModelType } from "../../photo-album-domain/photo-album-entity";

export class GetOrCreatePhotoAlbumCommand {
    constructor(
        public readonly userId: string,
        public readonly albumName: string,
        public readonly imageName: string,
    ) {}
}
@CommandHandler(GetOrCreatePhotoAlbumCommand)
export class GetOrCreatePhotoAlbumUseCase implements ICommandHandler<GetOrCreatePhotoAlbumCommand> {
    constructor(
        @InjectModel(PhotoAlbum.name) private photoAlbumModel: PhotoAlbumModelType,
        private photoAlbumRepository: PhotoAlbumRepository,
    ) {}

    async execute(command: GetOrCreatePhotoAlbumCommand) {
        const { userId, albumName, imageName } = command;

        // 1. Ищем альбом
        // (Твою проверку на 'defaultAlbum' можно упростить, если ты просто передаешь строку)
        let photoAlbum = await this.photoAlbumRepository.findPhotoAlbumByName(userId, albumName);

        // 2. Если нет — создаем
        if (!photoAlbum) {
            photoAlbum = this.photoAlbumModel.createPhotoAlbumInstance({
                albumName,
                albumCoverName: imageName,
                userId
            });

            await this.photoAlbumRepository.save(photoAlbum);
        }

        // Возвращаем альбом (он либо найден, либо только что создан)
        return photoAlbum;
    }
}