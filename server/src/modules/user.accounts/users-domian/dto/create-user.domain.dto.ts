export class CreateUserDomainDto {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}