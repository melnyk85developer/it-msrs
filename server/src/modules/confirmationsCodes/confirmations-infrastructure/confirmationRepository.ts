import { Injectable } from '@nestjs/common';
import { Confirmation, ConfirmationDocument, type ConfirmationModelType } from '../confirmation-model';
import { ConfDto } from '../dto/confDto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongoose';

@Injectable()
export class ConfirmationRepository {
    constructor(
        @InjectModel(Confirmation.name) private ConfirmationModel: ConfirmationModelType,
    ) { }

    async findConfirmationById(id: string): Promise<ConfirmationDocument | null> {
        return this.ConfirmationModel.findOne({
            _id: id,
            // deletedAt: null,
        });
    }

    async saveConfirmation(confirmation: ConfirmationDocument) {
        await confirmation.save();
    }

    async findAllConfirmationsRepository(): Promise<Confirmation[]> {
        return await this.ConfirmationModel.find()
    }
    async findByCodeConfirmationRepository(confirmationCode: string): Promise<Confirmation | null> {
        return await this.ConfirmationModel.findOne({
            confirmationCode: confirmationCode
        })
    }
    // async createConfirmationRepository(dto: ConfDto): Promise<ConfDto> {
    //     // console.log('ConfirmationService: - createCo dto: nfirmationRepository', dto)
    //     const code = await this.UserModel.create({
    //         ...dto,
    //         confirmationCode: dto.confirmationCode,
    //         expirationDate: dto.expirationDate,
    //         field: dto.field,
    //         userId: dto.userId
    //     })
    //     // console.log('ConfirmationService: - response DB code: createConfirmationRepository', code)
    //     return code
    // }
    // async updateConfirmationRepository(confirmationId: number, myShopDto: any): Promise<Confirmation> {
    //     const { confirmationCode, isBlocked, field, expirationDate, userId } = myShopDto
    //     const [updatedRowCount, [updateConfirmation]] = await this.UserModel.update(
    //         { confirmationCode, isBlocked, field, expirationDate, userId },
    //         { where: { id: confirmationId }, returning: true }
    //     )
    //     return updateConfirmation
    // }
    async deleteConfirmationUserIdRepository(userId: number): Promise<DeleteResult> {
        return await this.ConfirmationModel.deleteOne({
            userId: userId,
        })
    }
    async deleteConfirmationIdRepository(id: number): Promise<DeleteResult> {
        return await this.ConfirmationModel.deleteOne({
            id: id
        })
    }
}
