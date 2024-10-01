import { createWalletClient, createPublicClient, custom, WalletClient, PublicClient, Account, WatchContractEventReturnType, parseAbiItem, parseAbi } from "viem";
import { sepolia } from "viem/chains";
import "viem/window";

import { tokenAbi } from "../abis/token.ts";

declare global {
  interface Window {
    walletClient: WalletClient | null;
    publicClient: PublicClient | null;
  }

  interface ChainError extends Error {
    code?: number;
  }
}

export const address0 = "0x0000000000000000000000000000000000000000";

export function getIsLoggedIn(): boolean {
  return !!window.publicClient && !!window.walletClient;
}

export function resetClients(): void {
  window.walletClient = null;
  window.publicClient = null;
}

export function isRightChainId(chainId: number): boolean {
  return chainId === sepolia.id;
}

export function getTokenAddress(): string | undefined {
  return import.meta.env.VITE_REACT_APP_TOKEN_ADDRESS;
}

export function getTokenCreateBlock(): string | undefined {
  return import.meta.env.VITE_REACT_APP_TOKEN_CREATE_BLOCK_NUMBER;
}

export async function clientLogin() {
  let transport;
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      transport = custom(window.ethereum);
      console.log("Wallet connected successfully!");
    } catch (error) {
      console.error("User denied wallet connection", error);
      throw new Error("User denied wallet connection");
    }
  } else {
    const errorMessage = "No Web3 wallet detected.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: transport,
  });
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: transport,
  });

  window.walletClient = walletClient;
  window.publicClient = publicClient;

  const userAddress = await getUserAddress();

  return userAddress;
}

export async function getUserAddress() {
  if (!window.walletClient) return null;
  const addresses = await window.walletClient.getAddresses();
  return addresses[0];
}

export async function getEtherBalance(accountAddress: string) {
  if (!window.publicClient || !accountAddress.startsWith('0x')) return null;
  return await window.publicClient.getBalance({ address: accountAddress as `0x${string}` });
}

export async function getChainId() {
  if (!window.publicClient) return null;
  return await window.publicClient.getChainId();
}

export async function getTokenName(tokenAddress: string) {
  if (!window.publicClient || !tokenAddress.startsWith('0x')) return null;

  return await window.publicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenAbi,
    functionName: "name",
  });
}

export async function getTokenBalance(tokenAddress: string, userAddress: string): Promise<bigint | null> {
  if (!window.publicClient || !tokenAddress.startsWith('0x')) return null;

  const balance = await window.publicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [userAddress],
  });

  return balance as bigint;
}

export async function getTokenTotalSupply(tokenAddress: string): Promise<bigint | null> {
  if (!window.publicClient || !tokenAddress.startsWith('0x')) return null;

  const totalSupply = await window.publicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenAbi,
    functionName: "totalSupply",
  });

  return totalSupply as bigint;
}

export async function getAllowance(tokenAddress: string, owner: string, spender: string): Promise<bigint> {
  if (!window.publicClient || !tokenAddress.startsWith('0x') || !owner.startsWith('0x') || !spender.startsWith('0x')) return BigInt(0);

  const allowance = await window.publicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenAbi,
    functionName: "allowance",
    args: [owner, spender],
  });

  return allowance as bigint;
}

export async function getTokenOwner(tokenAddress: string) {
  if (!window.publicClient || !tokenAddress.startsWith('0x')) return null;

  return await window.publicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenAbi,
    functionName: "owner",
  });
}

export async function getTokenDecimals(tokenAddress: string): Promise<number | null> {
  if (!window.publicClient || !tokenAddress.startsWith('0x')) return null;

  const decimals = await window.publicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenAbi,
    functionName: "decimals",
  });
  return decimals as number;
}

export async function getApprovalEvents(tokenAddress: string, userAddress: string | Account, fromBlock: bigint, toBlock: bigint) {
  if (!window.publicClient || !tokenAddress.startsWith('0x') || (typeof userAddress == "string" ? !userAddress.startsWith('0x') : !userAddress.address.startsWith('0x'))) return null;

  const logs = await window.publicClient.getLogs({  
    address: tokenAddress as `0x${string}`,
    event: parseAbiItem('event Approval(address indexed owner, address indexed spender, uint256 value)'),
    args: {
      owner: userAddress as `0x${string}`
    },
    fromBlock: fromBlock,
    toBlock: toBlock
  });

  return logs;
}

export async function getApprovalsWithBlocksGap(tokenAddress: string, userAddress: string | Account, blocksGap: number = 1000) {
  const blockNumber = await getBlockNumber();
  const tokenCreateBlockNumber = await getTokenCreateBlock();
  const events = [];
  let lastBlockHandled; 
  const approvals = new Map();
  
  if (!blockNumber || !tokenCreateBlockNumber) return null;
  lastBlockHandled = BigInt(tokenCreateBlockNumber);

  console.log("Getting approvals... From block", lastBlockHandled, "to block", blockNumber);

  let progress = BigInt(0);

  while (lastBlockHandled < blockNumber!) {
    const fromBlock = lastBlockHandled;
    const toBlock: bigint = lastBlockHandled + BigInt(blocksGap);
    const logs = await getApprovalEvents(tokenAddress, userAddress!, BigInt(fromBlock), BigInt(toBlock));
    for (const approval of logs!) {
      const spender = approval.args.spender;
      const value = approval.args.value;
      approvals.set(spender, value);
    }
    events.push(logs);
    lastBlockHandled = toBlock;
    
    progress = (BigInt(100) * (lastBlockHandled - BigInt(tokenCreateBlockNumber)) / (blockNumber - BigInt(tokenCreateBlockNumber)));
    if (progress % BigInt(5) == BigInt(0)) console.log(`Approval loading progress: ${progress}%`);
  }

  console.log("Approvals ->", approvals);

  return approvals;
}

export async function getBlockNumber() {
  if (!window.publicClient) return null;
  return await window.publicClient.getBlockNumber();
}

export async function getBlockTimestamp(blockNumber: bigint) {
  if (!window.publicClient) return null;
  const block = await window.publicClient.getBlock({blockNumber});
  return block.timestamp;
}

export async function getLastActionsWithBlocksGap(tokenAddress: string, userAddress?: string | Account, actionsAmount: number = 10, blocksGap: number = 1000) {
  if (!window.publicClient || !tokenAddress.startsWith('0x') || (userAddress && (typeof userAddress == "string" ? !userAddress.startsWith('0x') : !userAddress.address.startsWith('0x')))) return null;

  const tokenCreatedBlockStr = await getTokenCreateBlock();
  const blockNumber = await getBlockNumber();
  const actions = [];
  const tokenCreatedBlock = tokenCreatedBlockStr ? BigInt(tokenCreatedBlockStr) : BigInt(0);;
  let lastBlockHandled = blockNumber ? BigInt(blockNumber) : BigInt(0);
  let totalLogsAmount = 0;

  while (totalLogsAmount < actionsAmount && lastBlockHandled > tokenCreatedBlock) {
    const fromBlock = lastBlockHandled - BigInt(blocksGap);
    const toBlock: bigint = lastBlockHandled; 

    const logs = await window.publicClient.getLogs({
      address: tokenAddress as `0x${string}`,
      events: parseAbi([ 
        'event Approval(address indexed owner, address indexed spender, uint256 value)',
        'event Transfer(address indexed from, address indexed to, uint256 value)',
      ]),
      fromBlock: fromBlock,
      toBlock: toBlock
    });

    if (userAddress) {
        for (const log of logs.reverse()) {
          if (totalLogsAmount < actionsAmount && actions.length < actionsAmount && ((log.eventName === "Approval" && log.args.owner === userAddress) || (log.eventName === "Transfer" && log.args.from === userAddress))) {
            actions.push(log);
            totalLogsAmount++;
          }
      }
    } else {
        for (const log of logs.reverse()) {
          if (actions.length < actionsAmount) {
            actions.push(log);
            totalLogsAmount++;
          }
      }
    }

    lastBlockHandled = fromBlock;
  }
  
  return actions;
}

export async function getTokenUserInfo(tokenAddress: string, userAddress: string | Account) {
  if (!window.publicClient || !tokenAddress.startsWith('0x') || (typeof userAddress == "string" ? !userAddress.startsWith('0x') : !userAddress.address.startsWith('0x'))) return null;

  const callRes = await window.publicClient.multicall({
    contracts: [
      {
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: 'totalSupply',
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: "decimals",
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: "name",
      }
    ]
  })
  
  const totalSupply = callRes[0].status == "success" ? callRes[0].result : BigInt(0);
  const balance = callRes[1].status == "success" ? callRes[1].result : BigInt(0);
  const decimals = callRes[2].status == "success" ? callRes[2].result : BigInt(0);
  const name = callRes[3].status == "success" ? callRes[3].result : "";

  return { balance, totalSupply, decimals, name };
}

export function watchMintEvent(tokenAddress: string, toAddress: string, _amount: bigint, onLogs: WatchContractEventReturnType) {
  if (!window.publicClient || !tokenAddress.startsWith('0x') || !toAddress.startsWith('0x')) return null;
  
  return window.publicClient.watchContractEvent({
    address: tokenAddress as `0x${string}`,
    abi: tokenAbi,
    eventName: "Transfer",
    args: {
      from: address0,
      to: toAddress,
      amount: _amount,
    },
    onLogs,
  });
}

export async function switchChain() {
  if (!window.walletClient) return null;

  try {
    await window.walletClient.switchChain({ id: sepolia.id });
    console.log("Successfully switched to targeted chain");
  } catch (error) {
    if ((error as ChainError).code === 4902) {
      console.log("Chain not available");
      try {
        await window.walletClient.addChain({ chain: sepolia });
      } catch (error) {
        console.error("Failed to add chain", error);
      }
    }
  }
}

export async function mintToken(tokenAddress: string, userAddress: string, amount: bigint) {
  if (!window.walletClient || !tokenAddress.startsWith('0x') || !userAddress.startsWith('0x')) return null;

  return await window.walletClient.writeContract({
    address: tokenAddress as `0x${string}`,
    account: userAddress as (`0x${string}` | Account),
    abi: tokenAbi,
    functionName: "mint",
    args: [amount],
    chain: sepolia,
  });
}

export async function transferToken(
  tokenAddress: string,
  userAddress: string,
  toAddress: string,
  amount: bigint
) {
  if (!window.walletClient || !tokenAddress.startsWith('0x') || !userAddress.startsWith('0x') || !toAddress.startsWith('0x')) return null;

  return await window.walletClient.writeContract({
    address: tokenAddress as `0x${string}`,
    account: userAddress as (`0x${string}` | Account),
    abi: tokenAbi,
    functionName: "transfer",
    args: [toAddress, amount],
    chain: sepolia,
  });
}

export async function approveToken(
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  amount: bigint
) {
  if (!window.walletClient || !tokenAddress.startsWith('0x') || !ownerAddress.startsWith('0x') || !spenderAddress.startsWith('0x')) return null;

  return await window.walletClient.writeContract({
    address: tokenAddress as `0x${string}`,
    account: ownerAddress as (`0x${string}` | Account),
    abi: tokenAbi,
    functionName: "approve",
    args: [spenderAddress, amount],
    chain: sepolia,
  });
}

export async function transferFromToken(
  tokenAddress: string,
  userAddress: string,
  senderAddress: string,
  recipientAddress: string,
  amount: bigint
) {
  if (!window.walletClient || !tokenAddress.startsWith('0x') || !userAddress.startsWith('0x') || !senderAddress.startsWith('0x') || !recipientAddress.startsWith('0x')) return null;

  return await window.walletClient.writeContract({
    address: tokenAddress as `0x${string}`,
    account: userAddress as (`0x${string}` | Account),
    abi: tokenAbi,
    functionName: "transferFrom",
    args: [senderAddress, recipientAddress, amount],
    chain: sepolia,
  });
}

export async function burnToken(tokenAddress: string, userAddress: string | Account, amount: bigint) {
  if (!window.walletClient || !tokenAddress.startsWith('0x') || (typeof userAddress == "string" ? !userAddress.startsWith('0x') : !userAddress.address.startsWith('0x'))) return null;

  return await window.walletClient.writeContract({
    address: tokenAddress as `0x${string}`,
    account: userAddress as (`0x${string}` | Account),
    abi: tokenAbi,
    functionName: "burn",
    args: [amount],
    chain: sepolia,
  });
}

export async function transferOwnership(
  tokenAddress: string,
  userAddress: string,
  newOwnerAddress: string
) {
  if (!window.walletClient || !tokenAddress.startsWith('0x') || !userAddress.startsWith('0x') || !newOwnerAddress.startsWith('0x')) return null;

  return await window.walletClient.writeContract({
    address: tokenAddress as `0x${string}`,
    account: userAddress as (`0x${string}` | Account),
    abi: tokenAbi,
    functionName: "transferOwnership",
    args: [newOwnerAddress],
    chain: sepolia,
  });
}
