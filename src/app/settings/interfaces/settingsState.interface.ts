import { LanguageCode, LanguageName } from '../../shared/enums/laguage.enum';

export interface SettingsStateInterface {
  playersCount: number,
  playerWordsCount: number,
  firstTeamName: string,
  secondTeamName: string,
  firstTeamPlayers: string[],
  secondTeamPlayers: string[],
  playersQueue: PlayersQueueInterface[],
  language: LanguageInterface,
  timeOfRound: number
}

export interface InitialStateInterface {
  initialSettings: SettingsStateInterface,
  words: WordInterface[],
  game: {
    currentPlayer: PlayersQueueInterface,
    results: ResultsInterface[],
  }
}

export interface WordInterface {
  value: string,
  urls: string[]
}

export interface PlayersQueueInterface {
  name: string,
  teamIndex: number,
  team?: string,
}

export interface ResultsInterface {
  teamIndex: number,
  score: number,
  name: string
}

export interface SaveResultsInterface {
  teamIndex: number,
  score: number,
}

export interface LanguageInterface {
  code: LanguageCode,
  name: LanguageName,
}
