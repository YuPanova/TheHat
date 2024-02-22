import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { gameSelector, initialSettingsSelector, wordsSettingsSelector } from '../../../settings/store/selectors';
import {
  PlayersQueueInterface,
  ResultsInterface, SaveResultsInterface,
  SettingsStateInterface, WordInterface
} from '../../../settings/interfaces/settingsState.interface';
import {
  saveResultsAction,
  shuffleWordsAction
} from '../../../settings/store/actions/settingsAction';
import { shuffleArray } from '../../../shared/utils/utils';

@Component({
  selector: 'h-game-slot',
  templateUrl: './game-slot.component.html',
  styleUrls: ['./game-slot.component.scss', '../../../settings/components/fill-word/fill-word.component.scss']
})
export class GameSlotComponent implements OnInit, OnDestroy {

  public words: WordInterface[];
  public initialWords: WordInterface[];
  public totalWordsCount: number;
  public gameSettings: SettingsStateInterface;
  public currentPlayer: PlayersQueueInterface;
  public currentPlayerIndex = 0;
  public currentWordIndex = 1;

  //flags
  public isStarted = false;
  public showScore = false;
  public showTotalScore = false;

  public timeEnded = false;
  private timer;
  public score: {
    guessedWords: WordInterface[],
    unGuessedWords: WordInterface[]
  } = {
    guessedWords: [],
    unGuessedWords: [],
  };
  public results: ResultsInterface[];

  public seconds = 0;
  public timerLimit = 10;
  public pulseTime = 2;

  private audioSkip: HTMLAudioElement;
  private audioNext: HTMLAudioElement;
  private audioEnd: HTMLAudioElement;
  private readonly unsubscriber: Subject<void> = new Subject();

  constructor(private store: Store, private sanitizer: DomSanitizer ) { }

  @HostListener('document:keydown.enter', ['$event']) onEnterKey(): void {
    this.nextWord();
  }

  @HostListener('document:keydown.space', ['$event']) onSpaceKey(): void {
    this.skipWord();
  }

  private startTimer(): void {
    this.seconds = 0;
    this.timer = setInterval(() => {
      if (this.seconds >= this.timerLimit){
        clearInterval(this.timer);
        this.timeEnded = true;
        this.seconds = null;
        this.audioEnd.play();
      } else {
        this.seconds++
      }
    }, 1000);
  }

  private audioInit() {
    this.audioSkip = new Audio();
    this.audioEnd = new Audio();
    this.audioNext = new Audio();
    this.audioSkip.src = 'assets/sounds/failure.mp3';
    this.audioNext.src = 'assets/sounds/success.mp3';
    this.audioEnd.src = 'assets/sounds/end.mp3';
  }

  public ngOnInit(): void {
    this.store.dispatch(shuffleWordsAction());

    this.store.pipe(select(gameSelector))
      .pipe(takeUntil(this.unsubscriber))
      .subscribe( gameValues => { this.results = gameValues.results });

    combineLatest([
      this.store.pipe(select(wordsSettingsSelector)),
      this.store.pipe(select(initialSettingsSelector))
    ])
      .pipe(
        map(([words, gameSettings]) => {
          this.words = words;
          this.initialWords = words;
          this.totalWordsCount = words.length;
          this.gameSettings = gameSettings;
          this.timerLimit = this.gameSettings.timeOfRound;
          this.pulseTime = Math.ceil(this.gameSettings.timeOfRound / 100 * 15);
        }),
        takeUntil(this.unsubscriber),
      )
      .subscribe(() =>{
        this.currentPlayer = this.gameSettings.playersQueue[0];
      });

    this.audioInit();

  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  public getCurrentTeamName(): string {
    return this.currentPlayer.teamIndex ? this.gameSettings.secondTeamName : this.gameSettings.firstTeamName;
  }

  public nextPlayer(): void {
    if (this.currentPlayerIndex === this.gameSettings.playersCount-1){
      this.currentPlayerIndex = 0;
    } else {
      this.currentPlayerIndex++;
    }

    this.currentPlayer = this.gameSettings.playersQueue[this.currentPlayerIndex];
  }

  public nextRound(): void {
    this.saveTeamScore( this.currentPlayer.teamIndex, this.score.guessedWords.length);
    this.words = shuffleArray([...this.words, ...this.score.unGuessedWords]);
    this.nextPlayer();
    this.showScore = false;
    this.isStarted = false;
    this.score.guessedWords = [];
    this.score.unGuessedWords = [];
    if (!this.words.length) {
      this.showTotalScore = true;
    }
  }

  public nextWord(): void {
    this.audioNext.play();
    this.score.guessedWords.push(this.getCurrentWord());
    this.changeWord();
  }

  public skipWord(): void {
    this.audioSkip.play();
    this.score.unGuessedWords.push(this.getCurrentWord());
    this.changeWord();
  }

  public changeWord(): void {
    this.words = this.words.slice(1);
    if (this.timeEnded || !this.words.length){
      this.showScore = true;
      clearInterval(this.timer);
    }
  }

  public getCurrentWord(): WordInterface {
    this.currentWordIndex = this.totalWordsCount - this.words.length +1;
    return this.words[0];
  }

  public startRound(): void {
    this.showScore = false;
    this.isStarted = true;
    this.timeEnded = false;
    this.startTimer();
  }

  public newCycle(): void {
    this.words = this.initialWords;
    this.currentPlayer = this.gameSettings.playersQueue[0];
    this.showTotalScore = false;
  }

  public isStartRoundShow(): boolean{
    return !this.isStarted
          && !this.showScore
          && !!this.words.length
  }

  public isTotalScoreShow(): boolean {
    return this.showTotalScore
  }

  public isRoundScoreShow(): boolean {
    return this.showScore
  }

  public moveToUnGuessed(word: WordInterface): void {
    this.score.unGuessedWords.push(word);
    this.score.guessedWords = this.score.guessedWords.filter(el => el !== word)
  }

  public moveToGuessed(word: WordInterface): void {
    this.score.guessedWords.push(word);
    this.score.unGuessedWords = this.score.unGuessedWords.filter(el => el !== word)
  }

  public getPoints(): number {
    return this.score.guessedWords.length
  }

  public saveTeamScore(teamIndex: number, score: number): void {
    const addedScore: SaveResultsInterface = {
      teamIndex,
      score
    }

    this.store.dispatch(saveResultsAction({ teamScore: addedScore }));
  }

  public safeImageURl(url: string): SafeUrl{
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
