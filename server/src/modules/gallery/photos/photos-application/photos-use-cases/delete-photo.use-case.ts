import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { PhotoRepository } from "../../photos-infrastructure/photos-repository";

export class DeletePhotoCommand {
    constructor(public photoId: string) { }
}
@CommandHandler(DeletePhotoCommand)
export class DeletePhotoUseCase
    implements ICommandHandler<DeletePhotoCommand, void> {
    constructor(
        private photoRepository: PhotoRepository,
    ) { }

    async execute(command: DeletePhotoCommand) {
        const { photoId } = command
        const photo = await this.photoRepository.findPhotoByIdOrNotFoundFailRepository(photoId);
        // console.log('PhotoService: deletePhotoService - photo 😡 ', photo)
        // const isDeletedPhoto = await this.photoRepository.deletePhoto(photoId);

        photo.makeDeletedPhoto();
        await this.photoRepository.save(photo);
    }
}