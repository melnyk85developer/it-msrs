import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { Multer } from 'multer';
import { FilesService } from "src/modules/files/files.service";
import { InjectModel } from "@nestjs/mongoose";
import { MyShopsRepository } from "../../shops-infrastructure/shops-repository";
import { CreateMyShopsDto } from "../../shops-dto/create-shops.dto";
import { MyShops, type MyShopsModelType } from "../../shops-domain/shops-entity";

export class CreateMyShopsCommand {
    constructor(
        public userId: string,
        public readonly dto: Omit<CreateMyShopsDto, 'userId'>,
        // public image: Multer.File | null,
        // public miniature: Multer.File | null
    ) { }
}
@CommandHandler(CreateMyShopsCommand)
export class CreateMyShopsUseCase
    implements ICommandHandler<CreateMyShopsCommand, string> {
    constructor(
        @InjectModel(MyShops.name) private myShopsModel: MyShopsModelType,
        private commandBus: CommandBus,
        private myShopsRepository: MyShopsRepository,
        private filesService: FilesService,
    ) { }

    async execute(command: CreateMyShopsCommand) {
        const { 
            // image, 
            // miniature, 
            dto, 
            userId 
        } = command
        // console.log('CreateMyShopsUseCase - userId 😡 1', userId)
        // console.log('CreateMyShopsUseCase - dto 😡 2 dto.name', dto.name)

        // const imageName = await this.filesService.createPostFile(image);
        // const miniatureName = await this.filesService.createPostFile(miniature);
        // console.log('createPhotoService - imageName 😡 3', imageName)
        // console.log('createPhotoService - miniatureName 😡 4', miniatureName)

        const shop = this.myShopsModel.createMyShopsInstance({
            ...dto,
            userId: userId,
            // image: imageName,
            // miniature: miniatureName,
        });
        // console.log('CreateMyShopsUseCase: IS createMyShopsInstance - shop 😡 1', shop)
        await this.myShopsRepository.save(shop);
        // console.log('CreateMyShopsUseCase: IS createMyShopsInstance - shop 😡 2', shop)
        return shop._id.toString();
    }
}