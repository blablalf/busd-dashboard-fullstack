import { Module } from '@nestjs/common';
import { DataExtractionService } from './data-extraction-service';
import { ClientModule } from './client-module';
import { PrismaModule } from '../database/prisma.module';
import { DailyTransfersModule } from '../database/transfers/daily-transfers.module';

@Module({
  imports: [PrismaModule, ClientModule, DailyTransfersModule],
  providers: [DataExtractionService],
})
export class DataExtractionModule {}
