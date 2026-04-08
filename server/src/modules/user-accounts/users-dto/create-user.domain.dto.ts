import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Role } from "../users-domain/roles-user.data";
import { IsOptional } from "class-validator";

export class CreateUserDomainDto {
    login: string;
    email: string;
    passwordHash: string;

    avatar: string | null;
    name?: string | null;
    surname?: string | null;

    role: Role;
    isBot: boolean;
    @ApiProperty({ example: 'aiProvider', description: 'AI провайдер ассистента (если это бот)!' })
    @IsOptional()
    provider: string;
    @ApiProperty({ example: 'aiModel', description: 'AI модель ассистента (если это бот)!' })
    @IsOptional()
    model: string;
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