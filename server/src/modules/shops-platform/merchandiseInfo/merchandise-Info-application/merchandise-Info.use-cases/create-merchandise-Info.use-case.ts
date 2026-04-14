import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { MerchandiseInfoRepository } from "../../merchandiseInfo-infrastructure/merchandise-Info.repository";
import { CreateMerchandiseInfoDto } from "../../merchandise-Info-dto/create-merchandise-Info-dto";
import { InjectModel } from "@nestjs/mongoose";
import { MerchandiseInfo, type MerchandiseInfoModelType } from "../../merchandiseInfo-domain/merchandise-Info-entity";

export class CreateMerchandiseInfoCommand {
    constructor(
        public userId: string,
        public readonly dto: Omit<CreateMerchandiseInfoDto, 'userId'>
    ) { }
}
@CommandHandler(CreateMerchandiseInfoCommand)
export class CreateMerchandiseInfoUseCase
    implements ICommandHandler<CreateMerchandiseInfoCommand, string> {
    constructor(
        @InjectModel(MerchandiseInfo.name) private merchandiseInfoModel: MerchandiseInfoModelType,
        private merchandiseInfoRepository: MerchandiseInfoRepository
    ) { }

    async execute(command: CreateMerchandiseInfoCommand) {
        const { dto, userId } = command
        // console.log('CreatePhotoAlbumUseCase: - dto 😡 1', dto)
        // console.log('CreatePhotoAlbumUseCase: - albumCoverFile 😡 2', albumCoverFile)
        const merchandise = this.merchandiseInfoModel.createMerchandiseInfoInstance(dto)
        // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 save', photoAlbum)
        await this.merchandiseInfoRepository.save(merchandise);
        // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 res', photoAlbum)
        return merchandise._id.toString();
    }
}