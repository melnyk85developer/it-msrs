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
        public readonly dto: UpdateMyShopsDto,
        public image: Multer.File | null,
        public miniature: Multer.File | null
    ) { }
}
@CommandHandler(UpdateMyShopsCommand)
export class UpdateMyShopsUseCase
    implements ICommandHandler<UpdateMyShopsCommand, string> {
    constructor(
        private commandBus: CommandBus,

        private photoRepository: MyShopsRepository,
        private filesService: FilesService
    ) { }

    async execute(command: UpdateMyShopsCommand) {
        const { userId, shopId, image, dto, miniature } = command
        let newImageFileName
        let newMiniatureFileName

        // console.log('PhotoService: updatePhotoService - photoId, dto 😡 ', photoId, dto)
        const shop = await this.photoRepository.findMyShopsByIdOrNotFoundFailRepository(shopId);

        if (image && miniature) {
            newImageFileName = await this.filesService.createPostFile(image);
            newMiniatureFileName = await this.filesService.createPostFile(miniature);
        }

        // isAlbum = await this.photoAlbumService.getPhotoAlbumNameOrCreatedService(dto.userId, dto.albumName, dto.miniatureName)

        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)
        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)

        shop.updateMyShops({
            userId: userId,
            shopId: shopId,
            name: dto.name,
            title: dto.title,
            shopTypeId: dto.shopTypeId,
            // image: imageName,
            // miniature: miniatureName,
            // image: newImageFileName ? newImageFileName : dto.imageName,
            // miniature: newMiniatureFileName ? newMiniatureFileName : dto.miniatureName
        });
        // console.log('PhotoService: updatePhotoService - photo1 😡 ', photo)
        await this.photoRepository.save(shop);
        // console.log('PhotoService: updatePhotoService - photo2 😡 ', photo)
        return shop._id.toString();
    }
}