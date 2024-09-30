export class UpdateEventDto {
  eventName?: string;

  txHash?: string;

  from?: string;

  to?: string;

  owner?: string;

  spender?: string;

  value?: bigint;

  blockNumber?: bigint;
}
