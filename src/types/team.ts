export interface TeamPlayerResponse {
  success: boolean;
  data: Team[];
}

export interface Team {
  teamId: string;
  name: string;
  number: number;
  players: Player[] | null;
}

export interface Player {
  id: string;
  name: string;
  fullname: string | null;
  groupName: string | null;
}

