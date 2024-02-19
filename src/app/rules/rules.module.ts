import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RulesComponent } from './components/rules.component';

const routes = [
  {
    path: 'rules',
    component: RulesComponent,
  }
]

@NgModule({
  declarations: [ RulesComponent ],
  imports: [ CommonModule, RouterModule.forChild(routes), ],
  exports: [ RulesComponent ]
})
export class RulesModule { }
