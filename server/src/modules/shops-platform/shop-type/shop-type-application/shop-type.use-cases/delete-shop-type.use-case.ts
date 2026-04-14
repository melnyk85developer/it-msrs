import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { ShopTypeRepository } from "../../shop-type-infrastructure/shop-type.repository";

export class DeleteShopTypeCommand {
    constructor(public photoId: string) { }
}
@CommandHandler(DeleteShopTypeCommand)
export class DeleteShopTypeUseCase
    implements ICommandHandler<DeleteShopTypeCommand, void> {
    constructor(
        private photoRepository: ShopTypeRepository,
    ) { }

    async execute(command: DeleteShopTypeCommand) {
        const { photoId } = command
        const photo = await this.photoRepository.findShopTypeByIdOrNotFoundFailRepository(photoId);
        // console.log('PhotoService: deletePhotoService - photo 😡 ', photo)
        // const isDeletedPhoto = await this.photoRepository.deletePhoto(photoId);

        photo.makeDeletedShopType();
        await this.photoRepository.save(photo);
    }
}