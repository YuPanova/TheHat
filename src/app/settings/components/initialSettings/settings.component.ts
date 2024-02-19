import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { initialSettingsSelector } from '../../store/selectors';
import { SettingsStateInterface } from '../../interfaces/settingsState.interface';
import { settingsAction } from '../../store/actions/settingsAction';
import { LanguageCode, LanguageName } from '../../../shared/enums/laguage.enum';

@Component({
  selector: 'h-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoaded: boolean;
  selectedLanguage: any;
  languageCodes = Object.entries(LanguageCode).map(item => (
    { code: item[1], name: LanguageName[item[0]]}
  ));

  private readonly unsubscriber: Subject<void> = new Subject();

  constructor(private fb: FormBuilder, private store: Store, private router: Router) { }

  public ngOnInit(): void {
    this.initializeListeners();
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  public onSubmit(): void {
    const firstTeamPlayersArr = this.form.value.firstTeamPlayers.split(',') ;
    const secondTeamPlayersArr = this.form.value.secondTeamPlayers.split(',');

    const settings: SettingsStateInterface = {
      ...this.form.value,
      firstTeamPlayers: firstTeamPlayersArr,
      secondTeamPlayers: secondTeamPlayersArr,
      language: this.selectedLanguage
    }

    this.store.dispatch(settingsAction({ settings }));
    this.router.navigate(['/fill-words'])
  }

  private initializeListeners(): void {
    this.store.pipe(select(initialSettingsSelector), takeUntil(this.unsubscriber)).subscribe(
      state => {
        this.isLoaded = true;
        this.form = this.fb.group({
          ...state,
          firstTeamPlayers: state.firstTeamPlayers.length ? state.firstTeamPlayers.join(',') : '',
          secondTeamPlayers: state.secondTeamPlayers.length ? state.secondTeamPlayers.join(',') : '',
        });

        this.selectedLanguage = this.languageCodes.find(lang => lang.code === state.language.code);
      }
    )
  }
}
