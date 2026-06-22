export type MatchStatus = 'Aberto' | 'Ao Vivo' | 'Finalizado' | 'Fechado';

export interface Match {
  id: string;
  teamHome: string;
  teamAway: string;
  flagHome: string;
  flagAway: string;
  group: string;
  dateStr: string;
  status: MatchStatus;
  scoreHome?: number;
  scoreAway?: number;
  prize?: string;
  prizeImage?: string;
}

export interface GroupStanding {
  id: string;
  group_name: string;
  team_name: string;
  j: number;
  v: number;
  e: number;
  d: number;
  gp: number;
  gc: number;
  sg: number;
  pts: number;
}

export interface Prediction {
  id: string;
  matchId: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  scoreHome: number;
  scoreAway: number;
  betValue?: number; // valor em R$ ou fictício
  pointsCalculated?: number;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  totalBets: number;
  totalPoints: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  replyToId?: string;
  replyToMessage?: {
    id: string;
    content: string;
    profiles?: {
      name: string;
    };
  };
  profiles?: {
    name: string;
    avatar: string;
    email: string;
  };
}

export interface TeamSquad {
  id: string;
  team_name: string;
  coach: string | null;
  probable_formation: string | null;
  probable_lineup: string | null;
  goalkeepers: string[] | null;
  defenders: string[] | null;
  midfielders: string[] | null;
  forwards: string[] | null;
}

export type Screen = 
  | 'login'
  | 'register'
  | 'recovery'
  | 'tournaments'
  | 'notifications'
  | 'home'
  | 'chat'
  | 'hub-chat'
  | 'match-details'
  | 'ranking'
  | 'groups'
  | 'teams'
  | 'profile'
  | 'edit-profile'
  | 'change-password'
  | 'admin';
