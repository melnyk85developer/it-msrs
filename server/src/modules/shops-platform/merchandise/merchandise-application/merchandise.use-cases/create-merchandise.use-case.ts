import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { InjectModel } from "@nestjs/mongoose";
import { CreateMerchandiseDto } from "../../merchandise-dto/create-merchandise.dto";
import { Merchandise, type MerchandiseModelType } from "../../merchandise-domain/merchandise.entity";
import { MerchandiseRepository } from "../../merchandise-infrastructure/merchandise.repository";

export class CreateMerchandiseCommand {
    constructor(
        public userId: string,
        public readonly dto: Omit<CreateMerchandiseDto, 'userId' | 'merchandiseImgName' | 'merchandiseCoverName'>,
        public merchandiseFile?: Multer.File | null
    ) { }
}
@CommandHandler(CreateMerchandiseCommand)
export class CreateMerchandiseUseCase
    implements ICommandHandler<CreateMerchandiseCommand, string> {
    constructor(
        @InjectModel(Merchandise.name) private merchandiseModel: MerchandiseModelType,
        private merchandiseRepository: MerchandiseRepository
    ) { }

    async execute(command: CreateMerchandiseCommand) {
        const { dto, userId } = command
        // console.log('CreateMerchandiseUseCase: - dto 😡 1', dto)
        let isMerchandise = await this.merchandiseRepository.findMerchandiseByName(userId, dto.merchandiseName);
        let imageName
        // console.log('CreateMerchandiseUseCase: - isMerchandise 😡 2', isMerchandise)
        if (!isMerchandise) {
            const merchandise = this.merchandiseModel.createMerchandiseInstance(
                {
                    ...dto,
                    merchandiseImgName: imageName ? imageName : null,
                    merchandiseCoverName: imageName ? imageName : null,
                    userId
                }
            )
            // console.log('CreateMerchandiseUseCase: - merchandise 😡 save 3', merchandise)
            await this.merchandiseRepository.save(merchandise);
            // console.log('CreateMerchandiseUseCase: - merchandise 😡 res 4', merchandise)
            return merchandise._id.toString();
        } else {
            return isMerchandise._id.toString();
        }
    }
}