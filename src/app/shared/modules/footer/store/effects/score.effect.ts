import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { map } from 'rxjs/operators'

import { saveResultsAction, settingsAction } from '../../../../../settings/store/actions/settingsAction';
import { scoreChangedAction, settingsChangedAction } from '../actions/footerAction';

@Injectable()
export class ScoreEffect {
  changedScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveResultsAction),
      map((data) => {
        return scoreChangedAction(data);
      })
    )
  )

  changedSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(settingsAction),
        map((data) => {
          return settingsChangedAction(data);
        })
      )
  )

  constructor(private actions$: Actions) {}
}
