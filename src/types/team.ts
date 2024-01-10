export interface GroupPlayerResponse {
  success: boolean;
  data: Group[];
}

export interface Group {
  groupId: string;
  name: string;
  number: number;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
}
