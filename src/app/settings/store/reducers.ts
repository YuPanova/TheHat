import { Action, createReducer, on } from '@ngrx/store';
import { cloneDeep, shuffle } from 'lodash';

import { addWordAction, saveResultsAction, settingsAction, shuffleWordsAction } from './actions/settingsAction';
import { InitialStateInterface, ResultsInterface } from 'src/app/settings/interfaces/settingsState.interface';
import { mergeArrays } from '../../shared/utils/utils';
import { LanguageCode, LanguageName } from '../../shared/enums/laguage.enum';

const initialState: InitialStateInterface = {
  initialSettings: {
    playersCount: 4,
    playerWordsCount: 2,
    firstTeamName: 'Cats',
    secondTeamName: 'Dogs',
    firstTeamPlayers: ['one', 'two'],
    secondTeamPlayers: ['three', 'four'],
    timeOfRound: 10,
    playersQueue: [
      {name: 'one', teamIndex: 0},{name: 'three', teamIndex: 1},
      {name: 'two', teamIndex: 0},{name: 'four', teamIndex: 1}
    ],
    language: {
      code: LanguageCode.EN,
      name: LanguageName.EN
    },
  },
  words: [],
  game: {
    currentPlayer: null,
    results: [
      {
        name: 'Cats',
        teamIndex: 0,
        score: 0
      },
      {
        name: 'Dogs',
        teamIndex: 1,
        score: 0
      }
    ]
  }
}

const settingsReducer = createReducer(
  initialState,
  on(
    settingsAction,
    (state, action): InitialStateInterface => {
      const playersQueueArr = mergeArrays(action.settings.firstTeamPlayers, action.settings.secondTeamPlayers);
      const results: ResultsInterface[] = [{
        name: action.settings.firstTeamName,
        teamIndex: 0,
        score: 0
      }, {
        name: action.settings.secondTeamName,
        teamIndex: 1,
        score: 0
      }]
      return {
          ...state,
          initialSettings: {
            ...action.settings,
            playersQueue: playersQueueArr
          },
          game: {
            currentPlayer: null,
            results
          }
        }
      }
  ),
  on(
    addWordAction,
    (state, action): InitialStateInterface => {
      return {
        ...state,
        words: [...state.words, action.word]
      }
    }
  ),
  on(
    shuffleWordsAction,
    (state): InitialStateInterface => {
      return {
        ...state,
        words: shuffle(state.words)
      }
    }
  ),
  on(
    saveResultsAction,
    (state, action): InitialStateInterface => {
      // const results = {...state.game.results};
      // results[action.teamScore.teamIndex].score = action.teamScore.score;
      //TypeError: Cannot assign to read only property 'score' of object
      let deepCopy = cloneDeep(state.game.results);
      deepCopy[action.teamScore.teamIndex].score += action.teamScore.score;

      return {
        ...state,
        game: {
          ...state.game,
          results: deepCopy
        }
      }
    }
  ),
)

export function reducers(state: InitialStateInterface, action: Action) {
  return settingsReducer(state, action)
}
