import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WordInterface } from '../../../settings/interfaces/settingsState.interface';

@Component({
  selector: 'h-score-word',
  templateUrl: './score-word.component.html',
  styleUrls: ['./score-word.component.scss']
})
export class ScoreWordComponent {
  @Input() word: WordInterface;
  @Input() guessed = false;

  @Output() moveToGuessed = new EventEmitter<WordInterface>();
  @Output() moveToUnGuessed = new EventEmitter<WordInterface>();
}
