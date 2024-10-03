import { Module } from '@nestjs/common';
import { DailyTransfersService } from './daily-transfers.service';
import { DailyTransfersController } from './daily-transfers.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DailyTransfersController],
  providers: [DailyTransfersService],
  exports: [DailyTransfersService],
})
export class DailyTransfersModule {}
