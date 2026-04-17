import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { UpdateMyShopsDto } from "../../shops-dto/update-shops.dto";
import { MyShopsRepository } from "../../shops-infrastructure/shops-repository";

export class UpdateMyShopsCommand {
    constructor(
        public userId: string,
        public shopId: string,
        public readonly dto: Omit<UpdateMyShopsDto, 'userId'>,
        // public image: Multer.File | null,
        // public miniature: Multer.File | null
    ) { }
}
@CommandHandler(UpdateMyShopsCommand)
export class UpdateMyShopsUseCase
    implements ICommandHandler<UpdateMyShopsCommand, string> {
    constructor(
        private commandBus: CommandBus,

        private myShopsRepository: MyShopsRepository,
        private filesService: FilesService
    ) { }

    async execute(command: UpdateMyShopsCommand) {
        const {
            userId,
            shopId,
            dto,
            // image, 
            // miniature 
        } = command
        let newImageFileName
        let newMiniatureFileName

        // console.log('UpdateMyShopsUseCase: - userId 😡 ', userId)
        // console.log('UpdateMyShopsUseCase: - dto 😡 ', dto)
        const shop = await this.myShopsRepository.findMyShopsByIdOrNotFoundFailRepository(shopId);

        // if (image && miniature) {
        //     newImageFileName = await this.filesService.createPostFile(image);
        //     newMiniatureFileName = await this.filesService.createPostFile(miniature);
        // }

        // isAlbum = await this.photoAlbumService.getPhotoAlbumNameOrCreatedService(dto.userId, dto.albumName, dto.miniatureName)

        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)
        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)

        if (userId !== shop.userId) {
            // console.log('UpdateMyShopsUseCase: - shop 😡 userId !== shop.userId', shop)
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_SHOP_UPDATE)
        }

        shop.updateMyShops({
            userId,
            shopId: shopId,
            name: dto.name,
            title: dto.title,
            shopTypeId: dto.shopTypeId,
            shopBrandId: dto.shopBrandId,
            // image: imageName,
            // miniature: miniatureName,
            // image: newImageFileName ? newImageFileName : dto.imageName,
            // miniature: newMiniatureFileName ? newMiniatureFileName : dto.miniatureName
        });
        // console.log('UpdateMyShopsUseCase: - shop1 😡 ', shop)
        await this.myShopsRepository.save(shop);
        // console.log('UpdateMyShopsUseCase: - shop2 😡 ', shop)
        return shop._id.toString();
    }
}