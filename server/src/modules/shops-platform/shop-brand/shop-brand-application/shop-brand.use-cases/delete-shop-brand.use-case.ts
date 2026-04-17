import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { ShopBrandRepository } from "../../shop-brand-infrastructure/shop-brand.repository";

export class DeleteShopBrandCommand {
    constructor(
        public brandId: string,
        public userId: string,
    ) { }
}
@CommandHandler(DeleteShopBrandCommand)
export class DeleteShopBrandUseCase
    implements ICommandHandler<DeleteShopBrandCommand, void> {
    constructor(
        private shopBrandRepository: ShopBrandRepository,
    ) { }

    async execute(command: DeleteShopBrandCommand) {
        const { brandId, userId } = command
        const brand = await this.shopBrandRepository.findShopBrandByIdOrNotFoundFailRepository(brandId);
        // console.log('PhotoService: deletePhotoService - photo 😡 ', photo)
        // const isDeletedPhoto = await this.photoRepository.deletePhoto(photoId);
        if (userId !== brand.userId) {
            // console.log('UpdateMyShopsUseCase: - shop 😡 userId !== shop.userId', shop)
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_SHOP_BRAND_DELETE)
        }
        brand.makeDeletedShopBrand();
        await this.shopBrandRepository.save(brand);
    }
}