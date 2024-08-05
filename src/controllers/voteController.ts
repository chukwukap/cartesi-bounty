import { Address, Hex } from 'viem';
import { Vote, Election } from '../models/vote';
import { voteStorage } from '../storage/voteStorage';
import createClient from "openapi-fetch";
import { paths } from "../schema";

export class VoteController {
  private client: ReturnType<typeof createClient<paths>>;

  constructor() {
    this.client = createClient<paths>({ baseUrl: process.env.ROLLUP_HTTP_SERVER_URL });
  }

  async castVote(data: { voter: Address; candidate: string; timestamp: number; electionName: string }): Promise<void> {
    if (!voteStorage.isElectionActive(data.electionName)) {
      throw new Error(`Election ${data.electionName} is not active`);
    }

    const vote: Vote = {
      voter: data.voter,
      candidate: data.candidate,
      timestamp: data.timestamp,
      electionName: data.electionName
    };
    voteStorage.addVote(vote);
    console.log(`Vote cast: ${JSON.stringify(vote)}`);

    await this.client.POST("/notice", {
      body: { payload: `0x${Buffer.from(JSON.stringify(vote)).toString('hex')}` }
    });
  }

  async getResults(electionName: string): Promise<Record<string, number>> {
    const results = voteStorage.getResults(electionName);
    console.log(`Current results for ${electionName}: ${JSON.stringify(results)}`);

    await this.client.POST("/report", {
      body: { payload: `0x${Buffer.from(JSON.stringify(results)).toString('hex')}` }
    });

    return results;
  }

  async createElection(electionName: string, creator: Address): Promise<void> {
    const startTime = Date.now();
    voteStorage.createElection(electionName, creator, startTime);
    console.log(`Election created: ${electionName}`);

    await this.client.POST("/notice", {
      body: { payload: `0x${Buffer.from(JSON.stringify({ action: 'createElection', electionName, creator, startTime })).toString('hex')}` }
    });
  }

  async endElection(electionName: string, ender: Address): Promise<void> {
    const endTime = Date.now();
    voteStorage.endElection(electionName, endTime);
    console.log(`Election ended: ${electionName}`);

    await this.client.POST("/notice", {
      body: { payload: `0x${Buffer.from(JSON.stringify({ action: 'endElection', electionName, ender, endTime })).toString('hex')}` }
    });
  }

  async getElections(): Promise<Election[]> {
    const elections = voteStorage.getActiveElections();
    console.log(`Active elections: ${JSON.stringify(elections)}`);

    await this.client.POST("/report", {
      body: { payload: `0x${Buffer.from(JSON.stringify(elections)).toString('hex')}` }
    });

    return elections;
  }
}