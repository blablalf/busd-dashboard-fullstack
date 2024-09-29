import { Module } from '@nestjs/common';
import { ApiDataService } from './api-data.service';
import { ApiDataController } from './api-data.controller';

@Module({
  controllers: [ApiDataController],
  providers: [ApiDataService],
})
export class ApiDataModule {}
