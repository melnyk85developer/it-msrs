import { OmitType } from '@nestjs/swagger';
import { UpdateUserDto } from './create-user.dto';

export class UpdateUserInputDto extends OmitType(UpdateUserDto, ['deletedAt', 'updatedAt'] as const){}