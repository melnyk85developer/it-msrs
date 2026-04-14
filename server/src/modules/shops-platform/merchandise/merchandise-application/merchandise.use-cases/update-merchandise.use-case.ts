import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { MerchandiseRepository } from "../../merchandise-infrastructure/merchandise.repository";
import { UpdateMerchandiseDto } from "../../merchandise-dto/update-merchandise.dto";

export class UpdateMerchandiseCommand {
    constructor(
        public productId: string,
        public readonly dto: Omit<UpdateMerchandiseDto, 'albumId'>,
        public albumCoverFile: Multer.File | null,
    ) { }
}
@CommandHandler(UpdateMerchandiseCommand)
export class UpdateMerchandiseUseCase
    implements ICommandHandler<UpdateMerchandiseCommand, string> {
    constructor(
        private merchandiseRepository: MerchandiseRepository,
        private filesService: FilesService
    ) { }

    async execute(command: UpdateMerchandiseCommand) {
        const { albumCoverFile, dto, productId } = command
        let newImageFileName
        // console.log('PhotoAlbumService: updatePhotoAlbumService - albumId, dto 😡 ', albumId, dto)
        const merchandise = await this.merchandiseRepository.findMerchandiseByIdOrNotFoundFailRepository(productId);
        if (albumCoverFile) {
            newImageFileName = await this.filesService.createPostFile(albumCoverFile);
        }
        // console.log('PhotoAlbumService: updatePhotoAlbumService - newImageFileName 😡 ', newImageFileName)
        merchandise.updateMerchandise({
            ...dto,
            productId,
            merchandiseImgName: newImageFileName ? newImageFileName : dto.merchandiseCoverName ? dto.merchandiseCoverName : null,
            merchandiseCoverName: newImageFileName ? newImageFileName : dto.merchandiseCoverName ? dto.merchandiseCoverName : null
        });
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo1 😡 ', photo)
        await this.merchandiseRepository.save(merchandise);
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo2 😡 ', photo)
        return merchandise._id.toString();
    }
}