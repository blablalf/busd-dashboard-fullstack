import { Injectable, Logger } from '@nestjs/common';
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { env } from 'node:process';
import { parseAbi } from 'viem';
import { setTimeout } from 'timers/promises';

import { PrismaService } from '../database/prisma.service';
import ClientService from './client-service';
import { CreateEventDto } from '../database/event/dto/create-event.dto';
import { DailyTransfersService } from '../database/transfers/daily-transfers.service';

@Injectable()
export class DataExtractionService implements OnModuleInit, OnModuleDestroy {
  private unwatch;
  private websocketConnected: boolean = false;
  private retryInterval: number = 5000;
  private logger = new Logger(DataExtractionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly client: ClientService,
    private readonly dailyTransfersService: DailyTransfersService,
  ) {}

  async onModuleInit() {
    await this.extractData();
    this.setupWebsocket();
  }

  onModuleDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  }

  async setupWebsocket() {
    while (!this.websocketConnected) {
      try {
        this.unwatch = await this.listenEvents();
        this.websocketConnected = true;
        this.logger.log('WebSocket connection established.');
      } catch (error) {
        this.websocketConnected = false;
        this.logger.error('WebSocket connection failed, retrying...', error);
        await setTimeout(this.retryInterval);
      }
    }
  }

  async listenEvents() {
    const contractAddress = env.CONTRACT_ADDRESS;
    const lastBlockFetchedResult = await this.prisma.apiData.findFirst({
      select: { lastBlockFetched: true },
    });
    const lastBlockFetched: bigint =
      BigInt(lastBlockFetchedResult?.lastBlockFetched) ?? BigInt(0);

    return this.client.getClient().watchEvent({
      fromBlock: lastBlockFetched,
      events: parseAbi([
        'event Approval(address indexed owner, address indexed spender, uint256 value)',
        'event Transfer(address indexed from, address indexed to, uint256 value)',
      ]),
      address: contractAddress as `0x${string}`,
      onLogs: async (logs) => {
        for (const log of logs) {
          await this.handleLog(log, true);
        }
      },
      onError: async (error) => {
        this.logger.error('WebSocket error:', error);
        this.websocketConnected = false;
        this.setupWebsocket();
      },
    });
  }

  async handleLog(log, fromWebSocket: boolean = false) {
    const {
      args,
      eventName: name,
      transactionHash,
      blockNumber: eventBlockNumber,
    } = log;

    const from = 'from' in args ? (args.from as string) : null;
    const to = 'to' in args ? (args.to as string) : null;
    const owner = 'owner' in args ? (args.owner as string) : null;
    const spender = 'spender' in args ? (args.spender as string) : null;
    const value = args.value as bigint;

    const createEventDto: CreateEventDto = {
      eventName: name,
      txHash: transactionHash,
      from: from,
      to: to,
      owner: owner,
      spender: spender,
      value: value.toString(),
      blockNumber: eventBlockNumber.toString(),
      isFromWebSocket: fromWebSocket,
    };

    await this.prisma.event.create({
      data: createEventDto,
    });

    if (name === 'Transfer') {
      await this.handleTransfer(log);
    }

    await this.prisma.apiData.update({
      where: { id: 1 },
      data: { lastBlockFetched: eventBlockNumber },
    });
  }

  async handleTransfer(event) {
    if (event.eventName === 'Transfer') {
      const blockNumber = event.blockNumber;
      const block = await this.client.getClient().getBlock({ blockNumber });
      const timestamp = block.timestamp * BigInt(1000);
      const timestampNumber = Number(timestamp);

      const date = new Date(timestampNumber);
      date.setHours(0, 0, 0, 0);
      const dailyTransfer = await this.prisma.dailyTransfers.findUnique({
        where: { date },
      });

      if (dailyTransfer) {
        const oldTotalValueTransferred =
          await this.dailyTransfersService.findOne(date);
        const newTotalValueTransferred =
          BigInt(oldTotalValueTransferred.totalTransfers.toString()) +
          event.args.value;
        await this.prisma.dailyTransfers.update({
          where: { date },
          data: {
            totalTransfers: newTotalValueTransferred.toString(),
          },
        });
      } else {
        await this.prisma.dailyTransfers.create({
          data: {
            date,
            totalTransfers: event.args.value.toString(),
          },
        });
      }
    }
  }

  async extractData() {
    const lastBlockFetchedResult = await this.prisma.apiData.findFirst({
      select: { lastBlockFetched: true },
    });
    const lastBlockFetched: bigint =
      BigInt(lastBlockFetchedResult?.lastBlockFetched) ?? BigInt(0);
    const contractAddress = env.CONTRACT_ADDRESS;

    const currentBlock = await this.client.getClient().getBlockNumber();

    const events = await this.client.getClient().getLogs({
      address: contractAddress as `0x${string}`,
      events: parseAbi([
        'event Approval(address indexed owner, address indexed spender, uint256 value)',
        'event Transfer(address indexed from, address indexed to, uint256 value)',
      ]),
      fromBlock: lastBlockFetched,
      toBlock: currentBlock,
    });

    for (const event of events) {
      await this.handleLog(event, false);
    }

    await this.prisma.apiData.update({
      where: { id: 1 },
      data: { lastBlockFetched: BigInt(currentBlock) },
    });
  }
}
