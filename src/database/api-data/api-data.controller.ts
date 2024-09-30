import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { ApiDataService } from './api-data.service';
import { UpdateApiDatumDto } from './dto/update-api-datum.dto';

@Controller('api-data')
export class ApiDataController {
  constructor(private apiDataService: ApiDataService) {}

  @Post()
  reset() {
    return this.apiDataService.resetLastBlockFetched();
  }

  @Get()
  getLastFetchedBlock() {
    return this.apiDataService.getLastBlockFetched();
  }

  @Patch()
  update(@Body() updateApiDatumDto: UpdateApiDatumDto) {
    return this.apiDataService.updateLastBlockFetched(updateApiDatumDto);
  }
}
