import { Injectable, type OnModuleInit } from '@nestjs/common';
import { ApiData } from '@prisma/client';
import { UpdateApiDatumDto } from './dto/update-api-datum.dto';
import { env } from 'node:process';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApiDataService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async getLastBlockFetched() {
    return this.prisma.apiData.findFirst();
  }

  async onModuleInit() {
    const initialBlockFetched = BigInt(
      env.TOKEN_CREATE_BLOCK_NUMBER || BigInt(0),
    );
    const count = await this.prisma.apiData.count();
    if (count === 0) {
      await this.prisma.apiData.create({
        data: { lastBlockFetched: initialBlockFetched },
      });
    }
  }

  async resetLastBlockFetched() {
    const initialValue = BigInt(process.env.TOKEN_CREATE_BLOCK_NUMBER || 0);
    const count = await this.prisma.apiData.count();
    if (count === 0) {
      return this.prisma.apiData.create({
        data: { lastBlockFetched: initialValue },
      });
    }
    return this.prisma.apiData.update({
      where: { id: 1 },
      data: { lastBlockFetched: initialValue },
    });
  }

  async updateLastBlockFetched(
    updateApiDatumDto: UpdateApiDatumDto,
  ): Promise<ApiData> {
    const existingRecord = await this.getLastBlockFetched();

    // Always assume there's one record
    if (existingRecord) {
      return this.prisma.apiData.update({
        where: { id: 1 }, // Update the existing record
        data: updateApiDatumDto,
      });
    }
    // Create a new record if for some reason it doesn't exist
    return this.prisma.apiData.create({
      data: updateApiDatumDto,
    });
  }
}
