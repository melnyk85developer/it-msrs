import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { BasketMerchandiseRepository } from "../../basketMerchandise-infrastructure/basket-merchandise.repository";

export class DeleteBasketMerchandiseCommand {
    constructor(
        public productId: string,
    ) { }
}
@CommandHandler(DeleteBasketMerchandiseCommand)
export class DeleteBasketMerchandiseUseCase
    implements ICommandHandler<DeleteBasketMerchandiseCommand, string> {
    constructor(
        private basketMerchandiseRepository: BasketMerchandiseRepository
    ) { }

    async execute(command: DeleteBasketMerchandiseCommand) {
        const { productId } = command
        const product = await this.basketMerchandiseRepository.findBasketMerchandiseByIdOrNotFoundFailRepository(productId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        const isDeletedProduct = await this.basketMerchandiseRepository.deleteBasketMerchandise(productId);
        // console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        // photoAlbum.makeDeletedPhotoAlbum();
        // await this.photoAlbumRepository.save(photoAlbum);
        return isDeletedProduct._id
    }
}