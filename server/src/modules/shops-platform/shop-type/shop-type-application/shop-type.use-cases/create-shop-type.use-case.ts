import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { InjectModel } from "@nestjs/mongoose";
import { CreateShopTypeDto } from "../../shop-type-dto/create-shop-type.dto";
import { ShopType, type ShopTypeModelType } from "../../shop-type-domain/shop-type-entity";
import { ShopTypeRepository } from "../../shop-type-infrastructure/shop-type.repository";

export class CreateShopTypeCommand {
    constructor(
        public userId: string,
        public readonly dto: CreateShopTypeDto
    ) { }
}
@CommandHandler(CreateShopTypeCommand)
export class CreateShopTypeUseCase
    implements ICommandHandler<CreateShopTypeCommand, string> {
    constructor(
        @InjectModel(ShopType.name) private shopTypeModel: ShopTypeModelType,
        private commandBus: CommandBus,
        private shopTypeRepository: ShopTypeRepository
    ) { }

    async execute(command: CreateShopTypeCommand) {
        const { dto, userId } = command
        console.log('CreateShopTypeUseCase - userId 😡 1', userId)
        console.log('CreateShopTypeUseCase - dto 😡 2', dto.typeName)

        // console.log('CreateShopTypeUseCase - imageName 😡 3', imageName)
        // console.log('CreateShopTypeUseCase - miniatureName 😡 4', miniatureName)
        // isAlbum = await this.photoAlbumService.getPhotoAlbumNameOrCreatedService(userId, dto.albumName, miniatureName)
        
        const shopType = this.shopTypeModel.createShopTypeInstance(dto);
        console.log('CreateShopTypeUseCase: - shopType 😡 1', shopType)
        await this.shopTypeRepository.save(shopType);
        console.log('CreateShopTypeUseCase: - shopType 😡 2', shopType)
        return shopType._id.toString();
    }
}