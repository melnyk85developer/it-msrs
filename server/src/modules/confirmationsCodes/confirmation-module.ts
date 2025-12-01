import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Confirmation } from './confirmation-model';
import { AuthModule } from '../auth/authModule';
import { UsersModule } from '../users/usersModule';
import { User } from '../users/usersModel';
import { ConfirmationService } from './confirmations-infrastructure/confirmationRepository';

@Module({
  providers: [
    ConfirmationService,
  ],
  imports: [
    SequelizeModule.forFeature([Confirmation, User]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  exports: [
    ConfirmationService,
  ],
})
export class ConfirmationModule {}
