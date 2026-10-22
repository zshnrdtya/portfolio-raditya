export type TerminalCommandType =
  | 'WELCOME'
  | 'HELP'
  | 'ABOUT'
  | 'PROJECTS'
  | 'SKILLS'
  | 'EXPERIENCE'
  | 'AWARDS'
  | 'CONTACT'
  | 'GUESTBOOK'
  | 'STATS'
  | 'AI'
  | 'UNKNOWN'
  | 'LOGIN';

export interface TerminalHistoryItem {
  id: string;
  command: string;
  type: TerminalCommandType;
  rawArgs?: string;
  timestamp: number;
}
