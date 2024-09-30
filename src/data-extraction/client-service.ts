import { Injectable } from '@nestjs/common';
import { createPublicClient, http, type PublicClient } from 'viem';
import { sepolia } from 'viem/chains';
import { env } from 'node:process';

@Injectable()
export default class ClientService {
  private static client;

  constructor() {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(env.RPC_URL as string),
    });
    ClientService.client = publicClient;
  }

  static getClient(): PublicClient {
    return this.client;
  }
}
