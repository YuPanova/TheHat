import { ResultsInterface, SettingsStateInterface } from 'src/app/settings/interfaces/settingsState.interface';

export interface AppStateInterface {
  settings: SettingsStateInterface,
  footer: {results: ResultsInterface[]}
}
