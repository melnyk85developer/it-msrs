import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MerchandiseInfoRepository } from "../../merchandiseInfo-infrastructure/merchandise-Info.repository";
import { UpdateMerchandiseInfoDto } from "../../merchandise-Info-dto/update-merchandise-Info.dto";

export class UpdateMerchandiseInfoCommand {
    constructor(
        public infoId: string,
        public readonly dto: Omit<UpdateMerchandiseInfoDto, 'infoId'>
    ) { }
}
@CommandHandler(UpdateMerchandiseInfoCommand)
export class UpdateMerchandiseInfoUseCase
    implements ICommandHandler<UpdateMerchandiseInfoCommand, string> {
    constructor(
        private merchandiseInfoRepository: MerchandiseInfoRepository,
    ) { }

    async execute(command: UpdateMerchandiseInfoCommand) {
        const { dto, infoId } = command
        // console.log('PhotoAlbumService: updatePhotoAlbumService - albumId, dto 😡 ', albumId, dto)
        const info = await this.merchandiseInfoRepository.findMerchandiseInfoByIdOrNotFoundFailRepository(infoId);
        // console.log('PhotoAlbumService: updatePhotoAlbumService - newImageFileName 😡 ', newImageFileName)
        info.updateMerchandiseInfo({
            ...dto,
            infoId
        });
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo1 😡 ', photo)
        await this.merchandiseInfoRepository.save(info);
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo2 😡 ', photo)
        return info._id.toString();
    }
}