import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '../actionTypes'
import {
  SaveResultsInterface, SettingsStateInterface,
} from 'src/app/settings/interfaces/settingsState.interface';

export const scoreChangedAction = createAction(
  ActionTypes.SCORE_CHANGED,
  props<{teamScore: SaveResultsInterface}>()
)
export const settingsChangedAction = createAction(
  ActionTypes.SETTINGS_CHANGED,
  props<{settings: SettingsStateInterface}>()
)

