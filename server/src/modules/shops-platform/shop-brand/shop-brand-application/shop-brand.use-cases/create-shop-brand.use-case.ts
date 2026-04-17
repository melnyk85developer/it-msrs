import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { InjectModel } from "@nestjs/mongoose";
import { CreateShopBrandDto } from "../../shop-brand-dto/create-shop-brand.dto";
import { ShopBrand, type ShopTypeModelBrand } from "../../shop-brand-domain/shop-brand-entity";
import { ShopBrandRepository } from "../../shop-brand-infrastructure/shop-brand.repository";

export class CreateShopBrandCommand {
    constructor(
        public userId: string,
        public readonly dto: CreateShopBrandDto
    ) { }
}
@CommandHandler(CreateShopBrandCommand)
export class CreateShopBrandUseCase
    implements ICommandHandler<CreateShopBrandCommand, string> {
    constructor(
        @InjectModel(ShopBrand.name) private shopBrandModel: ShopTypeModelBrand,
        private commandBus: CommandBus,
        private shopBrandRepository: ShopBrandRepository
    ) { }

    async execute(command: CreateShopBrandCommand) {
        const { dto, userId } = command
        // console.log('CreateShopTypeUseCase - userId 😡 1', userId)
        // console.log('CreateShopTypeUseCase - dto 😡 2', dto.typeName)

        // console.log('CreateShopTypeUseCase - imageName 😡 3', imageName)
        // console.log('CreateShopTypeUseCase - miniatureName 😡 4', miniatureName)
        // isAlbum = await this.photoAlbumService.getPhotoAlbumNameOrCreatedService(userId, dto.albumName, miniatureName)
        
        const shopBrand = this.shopBrandModel.createShopBrandInstance({
            ...dto,
            userId
        });
        // console.log('CreateShopTypeUseCase: - shopType 😡 1', shopType)
        await this.shopBrandRepository.save(shopBrand);
        // console.log('CreateShopTypeUseCase: - shopType 😡 2', shopType)
        return shopBrand._id.toString();
    }
}