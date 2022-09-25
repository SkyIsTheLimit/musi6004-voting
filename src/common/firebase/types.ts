export interface VotingOption {
  id: string;
  label: string;
  cssBgValue: string;
  value: string;
}

export interface Session {
  id: string;
  isActive: boolean;
  startTime: number;
  endTime: number;
  options: VotingOption[];
}

export interface Vote {
  id: string;
  userId: string;
  sessionId: string;
  when: number;
  chosenOption: VotingOption;
}
