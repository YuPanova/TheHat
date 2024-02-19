import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStateInterface } from 'src/app/shared/interfaces/appState.interface';
import { InitialStateInterface } from 'src/app/settings/interfaces/settingsState.interface';

export const settingsFeatureSelector = createFeatureSelector<
  AppStateInterface,
  InitialStateInterface
>('settings')

export const initialSettingsSelector = createSelector(
  settingsFeatureSelector,
  (state: InitialStateInterface) => state.initialSettings
)

export const settingsLanguageSelector = createSelector(
  settingsFeatureSelector,
  (state: InitialStateInterface) => state.initialSettings.language
)

export const wordsSettingsSelector = createSelector(
  settingsFeatureSelector,
  (state: InitialStateInterface) => state.words
)

export const gameSelector = createSelector(
  settingsFeatureSelector,
  (state: InitialStateInterface) => state.game
)

