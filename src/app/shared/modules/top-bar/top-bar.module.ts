import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { TopBarComponent } from './components/top-bar.component';

@NgModule({
  declarations: [ TopBarComponent ],
  imports: [ CommonModule, RouterModule, MatIconModule, MatMenuModule ],
  exports: [ TopBarComponent ]
})
export class TopBarModule { }
