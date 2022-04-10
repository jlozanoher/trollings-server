export interface Player {
  points: number;
  title?: Title;
}

export interface Title {
  name: string;
  description: string;
  points: number;
}
