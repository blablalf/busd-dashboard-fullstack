import { Injectable, type OnModuleInit } from '@nestjs/common';
import type { PrismaService } from '../database/prisma.service';
import type { ApiData } from '@prisma/client';
import { UpdateApiDatumDto } from './dto/update-api-datum.dto';
import { env } from 'node:process';

@Injectable()
export class ApiDataService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async getLastBlockFetched(): Promise<ApiData> {
    return this.prisma.apiData.findFirst();
  }

  async onModuleInit() {
    const initialBlockFetched = BigInt(env.TOKEN_CREATE_BLOCK_NUMBER || 0);
    const count = await this.prisma.apiData.count();
    if (count === 0) {
      await this.prisma.apiData.create({
        data: { lastBlockFetched: initialBlockFetched },
      });
    }
  }

  async resetLastBlockFetched(): Promise<ApiData> {
    const initialValue = BigInt(process.env.TOKEN_CREATE_BLOCK_NUMBER || 0);
    const count = await this.prisma.apiData.count();
    if (count === 0) {
      return this.prisma.apiData.create({
        data: { lastBlockFetched: initialValue },
      });
    }
    const existingRecord = await this.getLastBlockFetched();
    return this.prisma.apiData.update({
      where: { lastBlockFetched: existingRecord.lastBlockFetched },
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
        where: { lastBlockFetched: existingRecord.lastBlockFetched }, // Update the existing record
        data: updateApiDatumDto,
      });
    }
    // Create a new record if for some reason it doesn't exist
    return this.prisma.apiData.create({
      data: updateApiDatumDto,
    });
  }
}
