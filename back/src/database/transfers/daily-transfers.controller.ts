import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DailyTransfersService } from './daily-transfers.service';
import { DailyTransfers } from '@prisma/client';
import { UpdateDailyTransferDto } from './dto/update-daily-transfer.dto';

@Controller('transfers')
export class DailyTransfersController {
  constructor(private readonly transfersService: DailyTransfersService) {}

  @Post()
  create(@Body() createTransferDto: DailyTransfers) {
    return this.transfersService.create(createTransferDto);
  }

  @Get()
  findAll() {
    return this.transfersService.findAll();
  }

  @Get(':date')
  findOne(@Param('date') date: Date) {
    return this.transfersService.findOne(date);
  }

  @Patch(':date')
  update(
    @Param('date') date: Date,
    @Body() updateTransferDto: UpdateDailyTransferDto,
  ) {
    return this.transfersService.update(date, updateTransferDto);
  }

  @Delete(':date')
  remove(@Param('date') date: Date) {
    return this.transfersService.remove(date);
  }
}
