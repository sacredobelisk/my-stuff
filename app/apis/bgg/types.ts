interface BggPlayer {
  color: string;
  name: string;
  new: number;
  rating: number;
  score: number;
  startposition: number;
  userid: number;
  username: string;
  win: number;
}

export interface BggPlay {
  item: {
    subtypes: {
      subtype: {
        value: string;
      };
    };
    name: string;
    objecttype: string;
    objectid: number;
  };
  players: {
    player: BggPlayer[];
  };
  id: number;
  date: string;
  quantity: number;
  length: number;
  incomplete: number;
  nowinstats: number;
  location: string;
}

export interface BggPlaysResponse {
  plays: { play: BggPlay[] };
}
