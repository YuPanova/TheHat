import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FooterComponent } from './components/footer/footer.component';
import { ScoreEffect } from './store/effects/score.effect';
import { reducers } from './store/reducers';

@NgModule({
  declarations: [FooterComponent],
  exports: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ScoreEffect]),
    StoreModule.forFeature('footer', reducers),
  ]
})
export class FooterModule { }
