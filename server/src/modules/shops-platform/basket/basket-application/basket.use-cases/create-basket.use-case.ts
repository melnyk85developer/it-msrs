import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
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
        const { dto, userId } = command
        // console.log('CreatePhotoAlbumUseCase: - dto 😡 1', dto)
        // console.log('CreatePhotoAlbumUseCase: - albumCoverFile 😡 2', albumCoverFile)
        const basket = await this.basketRepository.findBasketById(dto.shopId);

        if (!basket) {
            const basket = this.basketModel.createBasketInstance(
                {
                    shopId: dto.shopId,
                    userId
                }
            )
            // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 save', photoAlbum)
            await this.basketRepository.save(basket);
            // console.log('CreatePhotoAlbumUseCase: - photoAlbum 😡 res', photoAlbum)
            return basket._id.toString();
        } else {
            return basket._id.toString();
        }
    }
}