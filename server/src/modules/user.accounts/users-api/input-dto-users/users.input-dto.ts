import { OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "../../users-dto/create-user.dto";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateUserInputDto extends OmitType(CreateUserDto, ['deletedAt', 'createdAt', 'updatedAt'] as const) {}