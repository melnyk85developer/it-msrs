import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { BasketMerchandiseRepository } from "../../basketMerchandise-infrastructure/basket-merchandise.repository";

export class DeleteBasketMerchandiseCommand {
    constructor(
        public merchandiseId: string,
        public userId: string,
    ) { }
}
@CommandHandler(DeleteBasketMerchandiseCommand)
export class DeleteBasketMerchandiseUseCase
    implements ICommandHandler<DeleteBasketMerchandiseCommand, string> {
    constructor(
        private basketMerchandiseRepository: BasketMerchandiseRepository
    ) { }

    async execute(command: DeleteBasketMerchandiseCommand) {
        const { merchandiseId, userId } = command
        const merchandise = await this.basketMerchandiseRepository.findBasketMerchandiseByIdOrNotFoundFailRepository(merchandiseId);
        // console.log('DeleteBasketMerchandiseUseCase: - photoAlbum 😡 ', photoAlbum)

        // if (userId !== merchandise.userId) {
        //     throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_SHOP_UPDATE)
        // }
        const isDeletedProduct = await this.basketMerchandiseRepository.deleteBasketMerchandise(merchandiseId);
        // console.log('PhotoService: deletePhotoService - command 😡 ', command)
        // photoAlbum.makeDeletedPhotoAlbum();
        // await this.photoAlbumRepository.save(photoAlbum);
        return isDeletedProduct._id
    }
}