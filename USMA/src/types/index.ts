export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'coach' | 'player';
  userId: string;
}

export interface Team {
  id: string;
  teamName: string;
  coachId: string;
  coachName?: string;
  membersCount: number;
  members?: User[];
}

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  availability?: Availability[];
}

export interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface Lesson {
  id: string;
  coachId: string;
  playerId: string;
  date: string;
  startTime: string;
  endTime: string;
  coachName?: string;
  playerName?: string;
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  court: string;
  group: string;
}
