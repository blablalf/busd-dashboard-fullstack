export class CreateEventDto {
  eventName: string;

  txHash: string;

  from?: string;

  to?: string;

  owner?: string;

  spender?: string;

  value?: bigint;

  blockNumber: bigint;
}
