import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { UpdateMerchandiseTypeDto } from "../../merchandise-type-dto/update-merchandise-type.dto";
import { MerchandiseTypeRepository } from "../../merchandise-type-infrastructure/merchandise-type.repository";

export class UpdateMerchandiseTypeCommand {
    constructor(
        public typeId: string,
        public readonly dto: Omit<UpdateMerchandiseTypeDto, 'typeId'>
    ) { }
}
@CommandHandler(UpdateMerchandiseTypeCommand)
export class UpdateMerchandiseTypeUseCase
    implements ICommandHandler<UpdateMerchandiseTypeCommand, string> {
    constructor(
        private merchandiseTypeRepository: MerchandiseTypeRepository,
        private filesService: FilesService
    ) { }

    async execute(command: UpdateMerchandiseTypeCommand) {
        const { typeId, dto } = command
        // console.log('PhotoAlbumService: updatePhotoAlbumService - albumId, dto 😡 ', albumId, dto)
        let merchandiseType = await this.merchandiseTypeRepository.findMerchandiseTypeByIdOrNotFoundFailRepository(typeId);

        merchandiseType.updateMerchandiseType({
            ...dto,
            typeId,
        });
        // console.log('PhotoAlbumService: updatePhotoAlbumService - newImageFileName 😡 ', newImageFileName)

        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo1 😡 ', photo)
        await this.merchandiseTypeRepository.save(merchandiseType);
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo2 😡 ', photo)
        return merchandiseType._id.toString();
    }
}