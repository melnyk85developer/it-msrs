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
        public userId: string,
        public readonly dto: Omit<UpdateMerchandiseBrandDto, 'brandId' | 'userId'>
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
        const { dto, brandId, userId } = command

        // console.log('UpdateMerchandiseBrandUseCase: - dto, brandId, userId 😡 ', dto, brandId, userId)
        const brand = await this.merchandiseBrandRepository.findMerchandiseBrandByIdOrNotFoundFailRepository(brandId);
        // console.log('UpdateMerchandiseBrandUseCase: - brand 😡 ', brand)

        if (userId !== brand.userId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_MERCHANDISE_BRAND_UPDATE)
        }
        brand.updateMerchandiseBrand({
            ...dto,
            userId,
            brandId
        });
        // console.log('UpdateMerchandiseBrandUseCase: - brand1 😡 ', brand)
        await this.merchandiseBrandRepository.save(brand);
        // console.log('UpdateMerchandiseBrandUseCase: - brand2 😡 ', brand)
        return brand._id.toString();
    }
}