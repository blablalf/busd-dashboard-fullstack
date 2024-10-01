export class CreateEventDto {
  eventName: string;

  txHash: string;

  from?: string;

  to?: string;

  owner?: string;

  spender?: string;

  value: string;

  blockNumber: string;
}
