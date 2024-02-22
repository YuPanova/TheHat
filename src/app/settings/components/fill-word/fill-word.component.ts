import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { addWordAction } from '../../store/actions/settingsAction';
import { initialSettingsSelector, wordsSettingsSelector } from '../../store/selectors';
import { PlayersQueueInterface, SettingsStateInterface, WordInterface } from '../../interfaces/settingsState.interface';
import { GrammarCheckResponseInterface } from '../../interfaces/grammarCheckResponse.interface';
import { SettingsService } from '../../services/setting.service';
import { ImageResponseInterface } from '../../interfaces/imagesResponse.interface';

@Component({
  selector: 'h-fill-word',
  templateUrl: './fill-word.component.html',
  styleUrls: ['./fill-word.component.scss']
})
export class FillWordComponent implements OnInit, OnDestroy {
  public isValid = true;
  public isCheckedWord = false;
  public newWord: string;
  public words: WordInterface[];
  public filledWords: number;
  public currentTeamIndex = 0;
  public totalWordsCount;
  public gameSettings: SettingsStateInterface;
  public currentPlayer: PlayersQueueInterface;
  public currentTeamName: string;
  public replacements: string;
  public images: ImageResponseInterface[] = [];
  private readonly unsubscriber = new Subject();

  constructor(
    private store: Store,
    private router: Router,
    private settingsService: SettingsService
    ) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const word = (event.target as HTMLInputElement).value.toLowerCase();
    this.isValid = this.words.every(el => el.value.toLowerCase() !== word);
    if (this.isValid){
      this.newWord = word;
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onEnterKey(): void {
    this.isCheckedWord ? this.addWord() : this.check();
  }

  public ngOnInit(): void {
    // this.settingsService.createWebWorker();
    // this.settingsService.cacheMockedImages();

    this.settingsService.images.pipe(takeUntil(this.unsubscriber))
      .subscribe(res => {
        this.images = res;
      });

    combineLatest([
      this.store.pipe(select(wordsSettingsSelector)),
      this.store.pipe(select(initialSettingsSelector))
    ])
      .pipe(
        takeUntil(this.unsubscriber),
        map(([words, gameSettings]) => {
          this.words = words;
          this.gameSettings = gameSettings;
        })
      )
      .subscribe(() => {
        this.totalWordsCount = this.gameSettings.playerWordsCount * this.gameSettings.playersCount;
        if (this.words.length >= this.totalWordsCount){
          this.router.navigate(['/game']);
        } else {
          const currentPlayerIndex = Math.ceil((this.words.length + 1) / this.gameSettings.playerWordsCount) - 1;
          this.currentPlayer = this.gameSettings.playersQueue[currentPlayerIndex];
          this.filledWords = this.words.length % this.gameSettings.playerWordsCount;
          this.currentTeamName = (this.currentPlayer.teamIndex % 2) ?
            this.gameSettings.firstTeamName : this.gameSettings.secondTeamName;
          this.currentTeamIndex = this.currentPlayer.teamIndex;
        }
      })
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
    // this.settingsService.terminateWebWorker();
  }

  public check(): void {
    if (this.isValid && this.newWord.length){

      // this.settingsService.onWebWorker(this.newWord);

      this.settingsService.grammarCheck(this.newWord, this.gameSettings.language.code)
        .pipe(takeUntil(this.unsubscriber))
        .subscribe(
        (a: GrammarCheckResponseInterface) => {
          if (a.matches[0]?.replacements.length) {
            this.replacements = a.matches[0]?.message + ' Possible replacements: ';
            this.replacements += a.matches[0]?.replacements.slice(0, 10).map(res => res.value).join(', ');
          } else {
            this.isCheckedWord = true;
            this.replacements = null;
          }
        },
        err => {
          console.log(err, 'maybe no internet');
          this.isCheckedWord = true;
          this.replacements = null;
        }
      );
    }
  }

  public addWord(): void {
    if (this.words.length === this.gameSettings.playerWordsCount * this.gameSettings.playersCount){
      this.router.navigate(['/game']);
    } else {
      const urls = this.images.map(item => item.urls.small);
      this.store.dispatch(addWordAction({ word: {value: this.newWord , urls}}));
      this.newWord = '';
      this.replacements = null;
      this.images = [];
      this.isCheckedWord = false;
    }
  }

}
