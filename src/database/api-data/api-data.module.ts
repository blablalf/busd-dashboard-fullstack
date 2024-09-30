import { Module } from '@nestjs/common';
import { ApiDataService } from './api-data.service';
import { ApiDataController } from './api-data.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ApiDataController],
  providers: [ApiDataService],
})
export class ApiDataModule {}
