import { OmitType } from "@nestjs/swagger";

export class CreateUserDomainDto {
    login: string;
    email: string;
    password: string;

    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateUserInputDto extends OmitType(
    CreateUserDomainDto, [
        // 'password',
        'createdAt',
        'updatedAt',
        'deletedAt',
    ] as const) { }