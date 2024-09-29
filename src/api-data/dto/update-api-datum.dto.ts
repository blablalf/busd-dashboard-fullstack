import { PartialType } from '@nestjs/mapped-types';
import { CreateApiDatumDto } from './create-api-datum.dto';

export class UpdateApiDatumDto extends PartialType(CreateApiDatumDto) {
  lastBlockFetched: bigint;
}
