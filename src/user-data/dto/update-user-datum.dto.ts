import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDatumDto } from './create-user-datum.dto';

export class UpdateUserDatumDto extends PartialType(CreateUserDatumDto) {}
