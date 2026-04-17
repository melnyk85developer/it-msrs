import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { FilesService } from "src/modules/files/files.service";
import { InjectModel } from "@nestjs/mongoose";
import { MerchandiseType, type MerchandiseTypeModelType } from "../../merchandise-type-domain/merchandise-type-entity";
import { MerchandiseTypeRepository } from "../../merchandise-type-infrastructure/merchandise-type.repository";
import { CreateMerchandiseTypeDto } from "../../merchandise-type-dto/create-merchandise-type-dto";

export class CreateMerchandiseTypeCommand {
    constructor(
        public userId: string,
        public readonly dto: CreateMerchandiseTypeDto
    ) { }
}
@CommandHandler(CreateMerchandiseTypeCommand)
export class CreateMerchandiseTypeUseCase
    implements ICommandHandler<CreateMerchandiseTypeCommand, string> {
    constructor(
        @InjectModel(MerchandiseType.name) private merchandiseTypeModel: MerchandiseTypeModelType,
        private merchandiseTypeRepository: MerchandiseTypeRepository
    ) { }

    async execute(command: CreateMerchandiseTypeCommand) {
        const { dto, userId } = command
        // console.log('CreatePhotoAlbumUseCase: - dto 😡 1', dto)
        // console.log('CreatePhotoAlbumUseCase: - albumCoverFile 😡 2', albumCoverFile)
        let isProductType = await this.merchandiseTypeRepository.findMerchandiseTypeByName(userId, dto.merchandiseTypeName);

        if (!isProductType) {
            const productType = this.merchandiseTypeModel.createMerchandiseTypeInstance(
                {
                    ...dto,
                    userId,
                    merchandiseTypeName: dto.merchandiseTypeName
                }
            )
            // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 save', photoAlbum)
            await this.merchandiseTypeRepository.save(productType);
            // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 res', photoAlbum)
            return productType._id.toString();
        } else {
            return isProductType._id.toString();
        }
    }
}