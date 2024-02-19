import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ScoreWordComponent } from './components/score-word/score-word.component';
import { GameSlotComponent } from './components/game-slot/game-slot.component';

const routes = [
  {
    path: 'game',
    component: GameSlotComponent,
  },
];
@NgModule({
  declarations: [GameSlotComponent, ScoreWordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class GameModule { }
