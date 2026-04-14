import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MyShopsRepository } from "../../shops-infrastructure/shops-repository";

export class DeleteMyShopsCommand {
    constructor(public shopId: string) { }
}
@CommandHandler(DeleteMyShopsCommand)
export class DeleteMyShopsUseCase
    implements ICommandHandler<DeleteMyShopsCommand, void> {
    constructor(
        private myShopsRepository: MyShopsRepository,
    ) { }

    async execute(command: DeleteMyShopsCommand) {
        const { shopId } = command
        const shop = await this.myShopsRepository.findMyShopsByIdOrNotFoundFailRepository(shopId);
        // console.log('PhotoService: deletePhotoService - photo 😡 ', photo)
        // const isDeletedPhoto = await this.photoRepository.deletePhoto(photoId);

        shop.makeDeletedMyShops();
        await this.myShopsRepository.save(shop);
    }
}