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

interface BggStatus {
  fortrade: number;
  lastmodified: string;
  preordered: number;
  prevowned: number;
  own: number;
  want: number;
  wanttobuy: number;
  wanttoplay: number;
  wishlist: number;
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

export interface BggCollectionItem {
  collid: number;
  image: string;
  name: { sortindex: number; "#text": string };
  numplays: number;
  objectid: number;
  objecttype: string;
  status: BggStatus;
  subtype: string;
  thumbnail: string;
  yearpublished: number;
}

export interface BggCollectionResponse {
  items: { item: BggCollectionItem[] };
}
export interface BggPlaysResponse {
  plays: {
    page: number;
    play: BggPlay[];
    termsofuse: string;
    total: number;
    userid: number;
    username: string;
  };
}
