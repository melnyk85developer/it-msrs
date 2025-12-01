import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Confirmation } from '../confirmation-model';
import { ConfDto } from '../dto/confDto';
import { ErRes } from '../../../../src/shared/utils/ErRes';

@Injectable()
export class ConfirmationRepository {

    constructor(@InjectModel(Confirmation) 
        private readonly myConfirmationRepository: typeof Confirmation){}

    async findAllConfirmationRepository(): Promise<Confirmation[]>{
        try{
            return await this.myConfirmationRepository.findAll()
        }catch(error){
            throw new ErRes(-100, `Ошибка базы данных: findAllConfirmationRepository: ${error}`, error)
        }
    }
    async findByCodeConfirmationRepository(confirmationCode: string): Promise<Confirmation>{
        try{
            return await this.myConfirmationRepository.findOne({where: { confirmationCode }})
        }catch(error){
            throw new ErRes(-100, `Ошибка базы данных: findByCodeConfirmationRepository: ${error}`, error)
        }
    }
    async createConfirmationRepository(dto: ConfDto): Promise<ConfDto>{
        try{
            // console.log('ConfirmationService: - createCo dto: nfirmationRepository', dto)
            const code = await this.myConfirmationRepository.create({
                ...dto, 
                confirmationCode: dto.confirmationCode, 
                expirationDate: dto.expirationDate,
                field: dto.field,
                userId: dto.userId
            })  
            // console.log('ConfirmationService: - response DB code: createConfirmationRepository', code)
            return code  
        }catch(error){
            throw new ErRes(-100, `Ошибка базы данных: createConfirmationRepository: ${error}`, error)
        }
    }
    async updateConfirmationRepository(confirmationId: number, myShopDto: any): Promise<Confirmation>{
        const { confirmationCode, isBlocked, field, expirationDate, userId } = myShopDto
        try{
            const [updatedRowCount, [updateConfirmation]] = await this.myConfirmationRepository.update(
                { confirmationCode, isBlocked, field, expirationDate, userId },
                { where: { id: confirmationId }, returning: true }
            )
            return updateConfirmation
        }catch(error){
            throw new ErRes(-100, `Ошибка базы данных: updateConfirmationRepository: ${error}`, error)
        }
    }
    async deleteConfirmationUserIdRepository(userId: number): Promise<number> {
        try {
            return await this.myConfirmationRepository.destroy({
                where: { userId: userId },
            })
        }catch(error){
            throw new ErRes(-100, `Ошибка базы данных: deleteConfirmationUserIdRepository: ${error}`, error)
        }
    }
    async deleteConfirmationIdRepository(id: number): Promise<number> {
        try {
            return await this.myConfirmationRepository.destroy({where: { id: id }})
        }catch(error){
            throw new ErRes(-100, `Ошибка базы данных: deleteConfirmationUserIdRepository: ${error}`, error)
        }
    }
}
