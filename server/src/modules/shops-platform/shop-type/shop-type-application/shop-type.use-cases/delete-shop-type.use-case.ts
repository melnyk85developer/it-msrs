import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { ShopTypeRepository } from "../../shop-type-infrastructure/shop-type.repository";

export class DeleteShopTypeCommand {
    constructor(
        public shopId: string,
        public userId: string,
    ) { }
}
@CommandHandler(DeleteShopTypeCommand)
export class DeleteShopTypeUseCase
    implements ICommandHandler<DeleteShopTypeCommand, void> {
    constructor(
        private shopTypeRepository: ShopTypeRepository,
    ) { }

    async execute(command: DeleteShopTypeCommand) {
        const { shopId, userId } = command
        const shopType = await this.shopTypeRepository.findShopTypeByIdOrNotFoundFailRepository(shopId);
        // console.log('DeleteShopTypeUseCase - shopType 😡 ', shopType)
        // const isDeletedPhoto = await this.photoRepository.deletePhoto(photoId);
        if (userId !== shopType.userId) {
            // console.log('DeleteShopTypeUseCase - shopType 😡 userId !== shopType.userId', shopType)
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_SHOP_TYPES_DELETE)
        }
        shopType.makeDeletedShopType();
        await this.shopTypeRepository.save(shopType);
    }
}