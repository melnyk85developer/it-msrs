import { Injectable } from '@nestjs/common';
import { Confirmation, type ConfirmationModelType } from '../confirmation-model';
import { ConfDto } from '../dto/confDto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ConfirmationRepository {
    constructor(
        @InjectModel(Confirmation.name) private UserModel: ConfirmationModelType,
    ) { }

    async findAllConfirmationRepository(): Promise<Confirmation[]> {
        try {
            return await this.UserModel.find()
        } catch (error) {
            throw new DomainException(-100, `Ошибка базы данных: findAllConfirmationRepository: ${error}`, error)
        }
    }
    async findByCodeConfirmationRepository(confirmationCode: string): Promise<Confirmation> {
        try {
            return await this.UserModel.findOne({ where: { confirmationCode } })
        } catch (error) {
            throw new DomainException(-100, `Ошибка базы данных: findByCodeConfirmationRepository: ${error}`, error)
        }
    }
    async createConfirmationRepository(dto: ConfDto): Promise<ConfDto> {
        try {
            // console.log('ConfirmationService: - createCo dto: nfirmationRepository', dto)
            const code = await this.UserModel.create({
                ...dto,
                confirmationCode: dto.confirmationCode,
                expirationDate: dto.expirationDate,
                field: dto.field,
                userId: dto.userId
            })
            // console.log('ConfirmationService: - response DB code: createConfirmationRepository', code)
            return code
        } catch (error) {
            throw new DomainException(-100, `Ошибка базы данных: createConfirmationRepository: ${error}`, error)
        }
    }
    async updateConfirmationRepository(confirmationId: number, myShopDto: any): Promise<Confirmation> {
        const { confirmationCode, isBlocked, field, expirationDate, userId } = myShopDto
        try {
            const [updatedRowCount, [updateConfirmation]] = await this.UserModel.update(
                { confirmationCode, isBlocked, field, expirationDate, userId },
                { where: { id: confirmationId }, returning: true }
            )
            return updateConfirmation
        } catch (error) {
            throw new DomainException(-100, `Ошибка базы данных: updateConfirmationRepository: ${error}`, error)
        }
    }
    async deleteConfirmationUserIdRepository(userId: number): Promise<number> {
        try {
            return await this.UserModel.destroy({
                where: { userId: userId },
            })
        } catch (error) {
            throw new DomainException(-100, `Ошибка базы данных: deleteConfirmationUserIdRepository: ${error}`, error)
        }
    }
    async deleteConfirmationIdRepository(id: number): Promise<number> {
        try {
            return await this.UserModel.destroy({ where: { id: id } })
        } catch (error) {
            throw new DomainException(-100, `Ошибка базы данных: deleteConfirmationUserIdRepository: ${error}`, error)
        }
    }
}
