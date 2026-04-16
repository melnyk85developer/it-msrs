import { CommandBus, IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { BasketQueryRepository } from "../../basket-infrastructure/basket.query-repository"
import { BasketRepository } from "../../basket-infrastructure/basket.repository"
import { BasketViewDto } from "../../basket-dto/basket.view-dto"
import { CreateBasketCommand } from "./create-basket.use-case"

export class GetQueryBasketCommand {
    constructor(
        public userId: string,
    ) { }
}

@QueryHandler(GetQueryBasketCommand)
export class GetQueryBasketUseCase implements IQueryHandler<GetQueryBasketCommand> {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly basketRepository: BasketRepository,
        private readonly basketQueryRepository: BasketQueryRepository
    ) { }

    async execute(command: GetQueryBasketCommand): Promise<BasketViewDto> {
        const { userId } = command
        const basket = await this.basketQueryRepository.findBasketByUserI(userId)

        if (basket) {
            return BasketViewDto.mapToView(basket);
        } else {
            const basketId = await this.commandBus.execute<CreateBasketCommand, string>(
                new CreateBasketCommand(userId, { userId }),
            );
            // console.log('GetQueryBasketUseCase: - basketId', basketId)
            return await this.basketQueryRepository.findBasketByIdOrNotFoundFailRepository(basketId)
        }
    }
}
