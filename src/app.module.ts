import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import ClientService from './data-extraction/client-service';
import { DataExtractionService } from './data-extraction/data-extraction-service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, ClientService, DataExtractionService],
})
export class AppModule {}
