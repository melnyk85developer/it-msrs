import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { BasketRepository } from "../../basket-infrastructure/basket.repository";

export class DeleteBasketCommand {
    constructor(
        public userId: string,
        public basketId: string,
    ) { }
}
@CommandHandler(DeleteBasketCommand)
export class DeleteBasketUseCase
    implements ICommandHandler<DeleteBasketCommand, string> {
    constructor(
        private basketRepository: BasketRepository
    ) { }

    async execute(command: DeleteBasketCommand) {
        const { userId, basketId } = command
        // console.log('DeleteBasketUseCase: - basketId 😡 1', basketId)
        const basket = await this.basketRepository.findBasketByIdOrNotFoundFailRepository(basketId);
        // console.log('DeleteBasketUseCase: - basket 😡 2', basket)
        if(userId !== basket.userId){
            throw new DomainException(HTTP_STATUSES.FORBIDDEN_403)
        }
        const isDeletedBasket = await this.basketRepository.deleteBasket(basket._id.toString());
        // console.log('DeleteBasketUseCase: - isDeletedBasket 😡 3', isDeletedBasket);
        // basket.makeDeletedBasket();
        // await this.basketRepository.save(basket);
        return isDeletedBasket._id
    }
}