import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../users/usersModel';

@Table({ tableName: 'confirmation' })
export class Confirmation extends Model<Confirmation> {
    @Column({type: DataType.STRING,allowNull: false})
    confirmationCode: string;

    @Column({type: DataType.DATE, allowNull: false})
    expirationDate: Date;

    @Column({type: DataType.BOOLEAN, allowNull: false})
    isBlocked: boolean;

    @Column({type: DataType.STRING, allowNull: false})
    field: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;
}
