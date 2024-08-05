import { Vote, Election } from '../models/vote';
import { Address } from 'viem';

class VoteStorage {
  private votes: Vote[] = [];
  private elections: Election[] = [];

  addVote(vote: Vote): void {
    this.votes.push(vote);
  }

  getAllVotes(): Vote[] {
    return this.votes;
  }

  getResults(electionName: string): Record<string, number> {
    const results: Record<string, number> = {};
    for (const vote of this.votes.filter(v => v.electionName === electionName)) {
      results[vote.candidate] = (results[vote.candidate] || 0) + 1;
    }
    return results;
  }

  createElection(name: string, creator: Address, startTime: number): void {
    this.elections.push({
      name,
      creator,
      startTime,
      endTime: null,
      isActive: true
    });
  }

  endElection(name: string, endTime: number): void {
    const election = this.elections.find(e => e.name === name && e.isActive);
    if (election) {
      election.endTime = endTime;
      election.isActive = false;
    }
  }

  getActiveElections(): Election[] {
    return this.elections.filter(e => e.isActive);
  }

  isElectionActive(name: string): boolean {
    return this.elections.some(e => e.name === name && e.isActive);
  }
}

export const voteStorage = new VoteStorage();