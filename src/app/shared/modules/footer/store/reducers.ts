import { createReducer, on, Action } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import { ResultsInterface } from 'src/app/settings/interfaces/settingsState.interface';
import { scoreChangedAction, settingsChangedAction } from './actions/footerAction';

const initialState: { results: ResultsInterface[] } = {
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

const footerReducer = createReducer(
  initialState,
  on(
    scoreChangedAction,
    (state, action): { results: ResultsInterface[] } => {
      let deepCopy = cloneDeep(state);
      deepCopy.results[action.teamScore.teamIndex].score += action.teamScore.score;
      return {
        ...state,
        ...deepCopy
      }
    }
  ),
  on(
    settingsChangedAction,
    (state, action): any => {
      let deepCopy = cloneDeep(state);
      deepCopy.results[0].name = action.settings.firstTeamName;
      deepCopy.results[1].name = action.settings.secondTeamName;
      return {
        ...state,
        ...deepCopy
      }
    }
  ),
)

export function reducers(state, action: Action) {
  return footerReducer(state, action)
}
