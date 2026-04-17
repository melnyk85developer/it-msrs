import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { BasketMerchandiseRepository } from "../../basketMerchandise-infrastructure/basket-merchandise.repository";
import { CreateABasketMerchandiseDto } from "../../basketMerchandise-dto/create-basket-merchandise-dto";
import { InjectModel } from "@nestjs/mongoose";
import { BasketMerchandise, type BasketMerchandiseModelType } from "../../basketMerchandise-domain/basket-merchandise-entity";

export class CreateBasketMerchandiseCommand {
    constructor(
        public userId: string,
        public readonly dto: Omit<CreateABasketMerchandiseDto, 'userId'>
    ) { }
}
@CommandHandler(CreateBasketMerchandiseCommand)
export class CreateBasketMerchandiseUseCase
    implements ICommandHandler<CreateBasketMerchandiseCommand, string> {
    constructor(
        @InjectModel(BasketMerchandise.name) private basketMerchandiseModel: BasketMerchandiseModelType,
        private basketMerchandiseRepository: BasketMerchandiseRepository
    ) { }

    async execute(command: CreateBasketMerchandiseCommand) {
        const { dto, userId } = command
        // console.log('CreateBasketMerchandiseUseCase: - dto 😡 1', dto)
        // console.log('CreateBasketMerchandiseUseCase: - albumCoverFile 😡 2', albumCoverFile)
        let isBasketMerchandise
        let imageName

        isBasketMerchandise = await this.basketMerchandiseRepository.findBasketMerchandiseByName(userId, dto.merchandiseName);

        if (!isBasketMerchandise) {
            const basketMerchandise = this.basketMerchandiseModel.createBasketMerchandiseInstance(dto)
            // console.log('CreateBasketMerchandiseUseCase: - basketMerchandise 😡 save', basketMerchandise)
            await this.basketMerchandiseRepository.save(basketMerchandise);
            // console.log('CreateBasketMerchandiseUseCase: - basketMerchandise 😡 res', basketMerchandise)
            return basketMerchandise._id.toString();
        } else {
            return isBasketMerchandise._id.toString();
        }
    }
}