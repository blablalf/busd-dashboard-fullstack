import { Module } from '@nestjs/common';
import { DataExtractionService } from './data-extraction.service';
import DataExtractionController from './data-extraction.controller';
import { ClientModule } from './client-module';
import { PrismaModule } from '../database/prisma.module';
import { DailyTransfersModule } from '../database/transfers/daily-transfers.module';
import { ApiDataModule } from '../database/api-data/api-data.module';
import { UserDataModule } from '../database/user-data/user-data.module';
import { EventModule } from '../database/event/event.module';

@Module({
  imports: [
    PrismaModule,
    ClientModule,
    DailyTransfersModule,
    EventModule,
    ApiDataModule,
    UserDataModule,
  ],
  providers: [DataExtractionService],
  controllers: [DataExtractionController],
})
export class DataExtractionModule {}
