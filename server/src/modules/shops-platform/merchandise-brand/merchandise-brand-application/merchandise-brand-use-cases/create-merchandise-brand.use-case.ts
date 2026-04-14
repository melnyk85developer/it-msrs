import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MerchandiseBrandRepository } from "../../merchandise-brand-infrastructure/merchandise-brand.repository";
import { CreateMerchandiseBrandDto } from "../../merchandise-brand-dto/create-merchandise-brand-dto";
import { InjectModel } from "@nestjs/mongoose";
import { MerchandiseBrand, type MerchandiseBrandModelType } from "../../merchandise-brand-domain/merchandise-brand.entity";

export class CreateMerchandiseBrandCommand {
    constructor(
        public userId: string,
        public readonly dto: Omit<CreateMerchandiseBrandDto, 'userId'>
    ) { }
}
@CommandHandler(CreateMerchandiseBrandCommand)
export class CreateMerchandiseBrandUseCase
    implements ICommandHandler<CreateMerchandiseBrandCommand, string> {
    constructor(
        @InjectModel(MerchandiseBrand.name) private merchandiseBrandModel: MerchandiseBrandModelType,
        private merchandiseBrandRepository: MerchandiseBrandRepository
    ) { }

    async execute(command: CreateMerchandiseBrandCommand) {
        const { dto, userId } = command
        // console.log('CreatePhotoAlbumUseCase: - dto 😡 1', dto)
        // console.log('CreatePhotoAlbumUseCase: - albumCoverFile 😡 2', albumCoverFile)
        let isBrand = await this.merchandiseBrandRepository.findMerchandiseBrandByName(userId, dto.merchandiseBrandName);
        if (!isBrand) {
            const brand = this.merchandiseBrandModel.createMerchandiseBrandInstance(dto)
            // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 save', photoAlbum)
            await this.merchandiseBrandRepository.save(brand);
            // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 res', photoAlbum)
            return brand._id.toString();
        } else {
            return isBrand._id.toString();
        }
    }
}