export interface ShowData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons: string;
  Response: string;
}

export interface ShowDataError {
  Response: string;
  Error: string;
}

export interface Episode {
  title: string;
  released: string;
  imdbRating: string;
  id: string;
  season: number;
  episode: number;
}

export interface ExtraInfo {
  image: string;
  runtime: string;
  released: string;
  plot: string;
}

export enum ThemeOptions {
  Dark = "dark",
  Light = "light",
}

export enum TypeOfChart {
  Line = "line",
  Bar = "bar",
}
