import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { UpdateShopBrandDto } from "../../shop-brand-dto/update-shop-brand-dto";
import { ShopBrandRepository } from "../../shop-brand-infrastructure/shop-brand.repository";

export class UpdateShopBrandCommand {
    constructor(
        public brandId: string,
        public userId: string,
        public readonly dto: Omit<UpdateShopBrandDto, 'typeId' | 'userId'>
    ) { }
}
@CommandHandler(UpdateShopBrandCommand)
export class UpdateShopBrandUseCase
    implements ICommandHandler<UpdateShopBrandCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private shopBrandRepository: ShopBrandRepository,
    ) { }

    async execute(command: UpdateShopBrandCommand) {
        const { brandId, userId, dto } = command
        // console.log('PhotoService: updatePhotoService - photoId, dto 😡 ', photoId, dto)
        const shopBrand = await this.shopBrandRepository.findShopBrandByIdOrNotFoundFailRepository(brandId);

        if(userId !== shopBrand.userId){
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_SHOP_BRAND_UPDATE)
        }

        shopBrand.updateShopBrand({
            userId: userId,
            typeId: shopBrand._id.toString(),
            brandName: dto.brandName,
        });
        // console.log('PhotoService: updatePhotoService - photo1 😡 ', photo)
        await this.shopBrandRepository.save(shopBrand);
        // console.log('PhotoService: updatePhotoService - photo2 😡 ', photo)
        return shopBrand._id.toString();
    }
}