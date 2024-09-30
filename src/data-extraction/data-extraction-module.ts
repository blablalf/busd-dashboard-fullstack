import { Module } from '@nestjs/common';
import { DataExtractionService } from './data-extraction-service';

@Module({
  providers: [DataExtractionService],
})
export class DataExtractionModule {}
