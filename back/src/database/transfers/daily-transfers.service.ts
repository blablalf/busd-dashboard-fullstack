import { Injectable } from '@nestjs/common';
import { UpdateDailyTransferDto } from './dto/update-daily-transfer.dto';
import { PrismaService } from '../prisma.service';
import { DailyTransfers } from '@prisma/client';

@Injectable()
export class DailyTransfersService {
  constructor(private prisma: PrismaService) {}

  create(createTransferDto: DailyTransfers) {
    return this.prisma.dailyTransfers.create({
      data: createTransferDto,
    });
  }

  findAll() {
    return this.prisma.dailyTransfers.findMany();
  }

  findOne(date: Date) {
    return this.prisma.dailyTransfers.findUnique({
      where: { date },
    });
  }

  update(date: Date, updateTransferDto: UpdateDailyTransferDto) {
    return this.prisma.dailyTransfers.update({
      where: { date },
      data: updateTransferDto,
    });
  }

  remove(date: Date) {
    return this.prisma.dailyTransfers.delete({
      where: { date },
    });
  }
}
