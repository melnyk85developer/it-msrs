import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { BasketRepository } from "../../basket-infrastructure/basket.repository";

export class DeleteBasketCommand {
    constructor(
        public basketId: string,
    ) { }
}
@CommandHandler(DeleteBasketCommand)
export class DeleteBasketUseCase
    implements ICommandHandler<DeleteBasketCommand, string> {
    constructor(
        private basketRepository: BasketRepository
    ) { }

    async execute(command: DeleteBasketCommand) {
        const { basketId } = command
        await this.basketRepository.findBasketByIdOrNotFoundFailRepository(basketId);
        // console.log('DeleteBasketUseCase: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        const isDeletedBasket = await this.basketRepository.deleteBasket(basketId);
        // console.log('DeleteBasketUseCase: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        // photoAlbum.makeDeletedPhotoAlbum();
        // await this.photoAlbumRepository.save(photoAlbum);
        return isDeletedBasket._id
    }
}