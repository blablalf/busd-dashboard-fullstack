import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { env } from 'node:process';
import { parseAbi } from 'viem';

import { PrismaService } from '../database/prisma.service';
import ClientService from './client-service';
import { CreateEventDto } from '../database/event/dto/create-event.dto';
import { DailyTransfersService } from '../database/transfers/daily-transfers.service';

@Injectable()
export class DataExtractionService implements OnModuleInit {
  private unwatch;
  constructor(
    private readonly prisma: PrismaService,
    private readonly client: ClientService,
    private readonly dailyTransfersService: DailyTransfersService,
  ) {}

  async onModuleInit() {
    await this.extractData();
    this.unwatch = await this.listenEvents();
  }

  onModuleDestroy() {
    this.unwatch();
  }

  async extractData() {
    let lastBlockFetchedResult = await this.prisma.apiData.findFirst({
      select: { lastBlockFetched: true },
    });
    let lastBlockFetched: bigint =
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
      lastBlockFetchedResult = await this.prisma.apiData.findFirst({
        select: { lastBlockFetched: true },
      });
      lastBlockFetched =
        BigInt(lastBlockFetchedResult?.lastBlockFetched) ?? BigInt(0);
      const {
        args,
        eventName: name,
        transactionHash,
        blockNumber: eventBlockNumber,
      } = event;

      const from = 'from' in args ? (args.from as string) : null;
      const to = 'to' in args ? (args.to as string) : null;
      const owner = 'owner' in args ? (args.owner as string) : null;
      const spender = 'spender' in args ? (args.spender as string) : null;
      const value: bigint = args.value;

      const createEventDto: CreateEventDto = {
        eventName: name,
        txHash: transactionHash,
        from: from,
        to: to,
        owner: owner,
        spender: spender,
        value: value.toString(),
        blockNumber: eventBlockNumber.toString(),
      };

      await this.prisma.event.create({
        data: createEventDto,
      });

      // Check if event name is Transfer
      await this.handleTransfer(event);

      await this.prisma.apiData.update({
        where: { id: 1 },
        data: { lastBlockFetched: eventBlockNumber },
      });
    }

    await this.prisma.apiData.update({
      where: { id: 1 },
      data: { lastBlockFetched: BigInt(currentBlock) },
    });
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
        logs.map(async (log) => {
          // Add each event to the database
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
          };

          await this.prisma.event.create({
            data: createEventDto,
          });

          await this.handleTransfer(log);

          await this.prisma.apiData.update({
            where: { id: 1 },
            data: { lastBlockFetched: eventBlockNumber },
          });
        });
      },
    });
  }

  async handleTransfer(event) {
    if (event.eventName === 'Transfer') {
      console.log('Transfer event detected');
      // If so, get the timestamp of the block, and update daily transfers table
      const blockNumber = event.blockNumber;
      const block = await this.client.getClient().getBlock({ blockNumber });
      const timestamp = block.timestamp * BigInt(1000);
      const timestampNumber = Number(timestamp);
      console.log('timestamp:', timestampNumber);

      const date = new Date(timestampNumber);
      const dailyTransfer = await this.prisma.dailyTransfers.findUnique({
        where: { date },
      });

      if (dailyTransfer) {
        // retrieve the old total value transferred and increment it
        const oldTotalValueTransferred =
          await this.dailyTransfersService.findOne(date);
        console.log('oldTotalValueTransferred:', oldTotalValueTransferred);
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
}
