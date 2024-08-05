import { Address } from 'viem';

export interface Vote {
  voter: Address;
  candidate: string;
  timestamp: number;
  electionName: string;
}

export interface Election {
  name: string;
  creator: Address;
  startTime: number;
  endTime: number | null;
  isActive: boolean;
}