import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppStateInterface } from 'src/app/shared/interfaces/appState.interface';
import { ResultsInterface } from 'src/app/settings/interfaces/settingsState.interface';

export const footerFeatureSelector = createFeatureSelector<
  AppStateInterface,
  { results: ResultsInterface[] }
>('footer')

export const resultsSelector = createSelector(
  footerFeatureSelector,
  (state: {results: ResultsInterface[]}) => state.results
)

