import { Controller, Delete } from '@nestjs/common';
import { EventService } from 'src/database/event/event.service';
import { ApiDataService } from 'src/database/api-data/api-data.service';
import { UserDataService } from 'src/database/user-data/user-data.service';
import { DailyTransfersService } from 'src/database/transfers/daily-transfers.service';
import { DataExtractionService } from './data-extraction.service';

@Controller('all')
export default class DataExtractionController {
  constructor(
    private readonly transfersService: DailyTransfersService,
    private readonly eventService: EventService,
    private readonly apiDataService: ApiDataService,
    private readonly userDataService: UserDataService,
    private readonly dataExtractionService: DataExtractionService,
  ) {}

  @Delete()
  async reset() {
    this.transfersService.removeAll();
    this.eventService.removeAll();
    this.userDataService.removeAll();
    await this.apiDataService.resetLastBlockFetched();
    this.dataExtractionService.onModuleInit();
  }
}
