import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { MerchandiseRepository } from "../../merchandise-infrastructure/merchandise.repository";
import { UpdateMerchandiseDto } from "../../merchandise-dto/update-merchandise.dto";

export class UpdateMerchandiseCommand {
    constructor(
        public merchandiseId: string,
        public readonly dto: Omit<UpdateMerchandiseDto, 'productId'>,
        public userId: string,
        public merchandiseImg?: Multer.File | null,
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
        const { merchandiseImg, dto, userId, merchandiseId } = command
        let newImageFileName
        // console.log('UpdateMerchandiseUseCase: - productId, dto 😡 ', productId, dto)
        const merchandise = await this.merchandiseRepository.findMerchandiseByIdOrNotFoundFailRepository(merchandiseId);
        if (merchandiseImg) {
            newImageFileName = await this.filesService.createPostFile(merchandiseImg);
        }
        // console.log('UpdateMerchandiseUseCase: - merchandiseImg 😡 ', merchandiseImg)
        if (userId !== merchandise.userId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_MERCHANDISE_UPDATE)
        }
        merchandise.updateMerchandise({
            ...dto,
            userId,
            merchandiseId,
            merchandiseImgName: newImageFileName ? newImageFileName : dto.merchandiseCoverName ? dto.merchandiseCoverName : null,
            merchandiseCoverName: newImageFileName ? newImageFileName : dto.merchandiseCoverName ? dto.merchandiseCoverName : null
        });
        // console.log('UpdateMerchandiseUseCase: - merchandise1 😡 ', merchandise)
        await this.merchandiseRepository.save(merchandise);
        // console.log('UpdateMerchandiseUseCase: - merchandise2 😡 ', merchandise)
        return merchandise._id.toString();
    }
}