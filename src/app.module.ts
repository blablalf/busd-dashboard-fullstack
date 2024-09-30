import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ClientService from './data-extraction/client-service';
import { UserDataModule } from './database/user-data/user-data.module';
import { EventModule } from './database/event/event.module';
import { DataExtractionModule } from './data-extraction/data-extraction-module';
import { ApiDataModule } from './database/api-data/api-data.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ApiDataModule,
    DataExtractionModule,
    UserDataModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService, ClientService],
})
export class AppModule {}
