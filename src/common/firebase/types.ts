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
  userId: string;
  sessionId: string;
  when: number;
  color: string;
}

// Restricting the vote choices to these colors. If more colors needed add here.
export type VoteColor = 'red' | 'green' | 'yellow' | 'blue' | 'orange' | 'pink';

export interface AppData {
  colors: {
    red: number;
    green: number;
    blue: number;
    yellow: number;
    orange: number;
    pink: number;
  };
  isStarted: boolean;
  currentColor: string;
  startTime: number;
  timerAmt: number;
}
