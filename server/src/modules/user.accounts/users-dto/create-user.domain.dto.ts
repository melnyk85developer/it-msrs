import { OmitType } from "@nestjs/swagger";
import { Role } from "../users-domain/roles-user.data";

export class CreateUserDomainDto {
    login: string;
    email: string;
    passwordHash: string;

    role: Role;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
// //dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
// export class CreateUserInputDto extends OmitType(
//     CreateUserDomainDto, [
//         // 'password',
//         'createdAt',
//         'updatedAt',
//         'deletedAt',
//     ] as const) { }