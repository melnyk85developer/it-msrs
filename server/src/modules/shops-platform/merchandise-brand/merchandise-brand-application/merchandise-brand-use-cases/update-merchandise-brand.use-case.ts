import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { MerchandiseBrandRepository } from "../../merchandise-brand-infrastructure/merchandise-brand.repository";
import { UpdateMerchandiseBrandDto } from "../../merchandise-brand-dto/update-merchandise-brand.dto";

export class UpdateMerchandiseBrandCommand {
    constructor(
        public brandId: string,
        public readonly dto: Omit<UpdateMerchandiseBrandDto, 'brandId'>
    ) { }
}
@CommandHandler(UpdateMerchandiseBrandCommand)
export class UpdateMerchandiseBrandUseCase
    implements ICommandHandler<UpdateMerchandiseBrandCommand, string> {
    constructor(
        private merchandiseBrandRepository: MerchandiseBrandRepository,
        private filesService: FilesService
    ) { }

    async execute(command: UpdateMerchandiseBrandCommand) {
        const { dto, brandId } = command
        // console.log('PhotoAlbumService: updatePhotoAlbumService - albumId, dto 😡 ', albumId, dto)
        const brand = await this.merchandiseBrandRepository.findMerchandiseBrandByIdOrNotFoundFailRepository(brandId);
        // console.log('PhotoAlbumService: updatePhotoAlbumService - newImageFileName 😡 ', newImageFileName)
        brand.updateMerchandiseBrand({
            ...dto,
            brandId
        });
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo1 😡 ', photo)
        await this.merchandiseBrandRepository.save(brand);
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo2 😡 ', photo)
        return brand._id.toString();
    }
}