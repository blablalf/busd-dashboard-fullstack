import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserDataControllerController } from './user-data-controller/user-data-controller.controller';
import { DataExtraction } from './data-extraction/data-extraction';
import { PrismaService } from './database/prisma.service';
import { ApiDataModule } from './api-data/api-data.module';
import { UserDataModule } from './user-data/user-data.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [ApiDataModule, UserDataModule, EventModule],
  controllers: [AppController, UserDataControllerController],
  providers: [AppService, PrismaService, DataExtraction],
})
export class AppModule {}
