import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { CreateBasketDto } from "../../basket-dto/create-basket-dto";
import { InjectModel } from "@nestjs/mongoose";
import { Basket, type BasketModelType } from "../../basket-domain/basket-entity";
import { BasketRepository } from "../../basket-infrastructure/basket.repository";

export class CreateBasketCommand {
    constructor(
        public userId: string,
        public readonly dto: Omit<CreateBasketDto, 'userId'>
    ) { }
}
@CommandHandler(CreateBasketCommand)
export class CreateBasketUseCase
    implements ICommandHandler<CreateBasketCommand, string> {
    constructor(
        @InjectModel(Basket.name) private basketModel: BasketModelType,
        private basketRepository: BasketRepository
    ) { }

    async execute(command: CreateBasketCommand) {
        const { userId, dto } = command
        // console.log('CreateBasketUseCase: - dto 😡 1', dto)
        const basket = await this.basketRepository.findBasketByUserId(userId);

        if (!basket) {
            const basket = this.basketModel.createBasketInstance(
                {
                    // shopId: dto.shopId,
                    userId: userId
                }
            )
            // console.log('CreateBasketUseCase: - basket 😡 save', basket)
            await this.basketRepository.save(basket);
            // console.log('CreateBasketUseCase: - basket 😡 res', basket)
            return basket._id.toString();
        } else {
            return basket._id.toString();
        }
    }
}