import { Module } from '@nestjs/common';
import { DataExtractionService } from './data-extraction-service';
import { ClientModule } from './client-module';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule, ClientModule],
  providers: [DataExtractionService],
})
export class DataExtractionModule {}
