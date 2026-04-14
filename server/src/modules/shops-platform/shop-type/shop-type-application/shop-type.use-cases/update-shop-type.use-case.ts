import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { UpdateShopTypeDto } from "../../shop-type-dto/update-shop-type-dto";
import { ShopTypeRepository } from "../../shop-type-infrastructure/shop-type.repository";

export class UpdateShopTypeCommand {
    constructor(
        public typeId: string,
        public readonly dto: UpdateShopTypeDto
    ) { }
}
@CommandHandler(UpdateShopTypeCommand)
export class UpdateShopTypeUseCase
    implements ICommandHandler<UpdateShopTypeCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private shopTypeRepository: ShopTypeRepository,
    ) { }

    async execute(command: UpdateShopTypeCommand) {
        const { typeId, dto } = command
        let isAlbum

        // console.log('PhotoService: updatePhotoService - photoId, dto 😡 ', photoId, dto)
        const shopType = await this.shopTypeRepository.findShopTypeByIdOrNotFoundFailRepository(typeId);

        // isAlbum = await this.photoAlbumService.getPhotoAlbumNameOrCreatedService(dto.userId, dto.albumName, dto.miniatureName)

        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)
        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)

        shopType.updateShopType({
            userId: dto.userId,
            typeId: shopType._id.toString(),
            typeName: isAlbum.albumName,
        });
        // console.log('PhotoService: updatePhotoService - photo1 😡 ', photo)
        await this.shopTypeRepository.save(shopType);
        // console.log('PhotoService: updatePhotoService - photo2 😡 ', photo)
        return shopType._id.toString();
    }
}