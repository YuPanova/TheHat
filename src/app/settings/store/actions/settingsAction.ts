import { createAction, props } from '@ngrx/store'

import { ActionTypes } from 'src/app/settings/store/actionTypes'
import {
  SaveResultsInterface,
  SettingsStateInterface,
  WordInterface
} from 'src/app/settings/interfaces/settingsState.interface';

export const settingsAction = createAction(
  ActionTypes.SAVE_SETTINGS,
  props<{settings: SettingsStateInterface}>()
)

export const addWordAction = createAction(
  ActionTypes.ADD_NEW_WORD,
  props<{word: WordInterface}>()
)

export const shuffleWordsAction = createAction(
  ActionTypes.SHUFFLE_WORDS
)

export const saveResultsAction = createAction(
  ActionTypes.SAVE_RESULTS,
  props<{teamScore: SaveResultsInterface}>()
)
