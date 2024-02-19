import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { SettingsComponent } from './components/initialSettings/settings.component';
import { reducers } from './store/reducers';
import { FillWordComponent } from './components/fill-word/fill-word.component';

const routes = [
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'fill-words',
    component: FillWordComponent,
  }
]

@NgModule({
  declarations: [SettingsComponent, FillWordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('settings', reducers),
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCardModule,
    MatSelectModule,
  ]
})
export class SettingsModule { }
