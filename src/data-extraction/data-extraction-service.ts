import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { env } from 'node:process';
import { parseAbi } from 'viem';

import { PrismaService } from '../database/prisma.service';
import ClientService from './client-service';
import { CreateEventDto } from 'src/database/event/dto/create-event.dto';

@Injectable()
export class DataExtractionService implements OnModuleInit {
  private unwatch;
  constructor(
    private readonly prisma: PrismaService,
    private readonly client: ClientService,
  ) {}

  async onModuleInit() {
    await this.extractData();
    this.unwatch = await this.listenEvents();
  }

  onModuleDestroy() {
    this.unwatch();
  }

  async extractData() {
    const lastBlockFetchedResult = await this.prisma.apiData.findFirst({
      select: { lastBlockFetched: true },
    });
    const lastBlockFetched: bigint =
      lastBlockFetchedResult?.lastBlockFetched ?? BigInt(0);

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
      const value = args.value as bigint;

      const createEventDto: CreateEventDto = {
        eventName: name,
        txHash: transactionHash,
        from: from,
        to: to,
        owner: owner,
        spender: spender,
        value: value,
        blockNumber: eventBlockNumber,
      };

      await this.prisma.event.create({
        data: createEventDto,
      });

      await this.prisma.apiData.update({
        where: { lastBlockFetched },
        data: { lastBlockFetched: eventBlockNumber },
      });
    }

    await this.prisma.apiData.update({
      where: { lastBlockFetched },
      data: { lastBlockFetched: BigInt(currentBlock) },
    });
  }

  async listenEvents() {
    const contractAddress = env.CONTRACT_ADDRESS;
    const lastBlockFetchedResult = await this.prisma.apiData.findFirst({
      select: { lastBlockFetched: true },
    });
    const lastBlockFetched: bigint =
      lastBlockFetchedResult?.lastBlockFetched ?? BigInt(0);

    return this.client.getClient().watchEvent({
      fromBlock: lastBlockFetched,
      events: parseAbi([
        'event Approval(address indexed owner, address indexed sender, uint256 value)',
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
          const value = args.value;

          await this.prisma.event.create({
            data: {
              eventName: name,
              txHash: transactionHash,
              from,
              to,
              owner,
              spender,
              value,
              blockNumber: eventBlockNumber,
            },
          });

          await this.prisma.apiData.update({
            where: { lastBlockFetched },
            data: { lastBlockFetched: eventBlockNumber },
          });
        });
      },
    });
  }
}
