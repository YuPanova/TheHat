import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'h-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {

  constructor(public readonly router: Router) { }

  public goTo(urlToRedirect: string): void {
    this.router.navigateByUrl(urlToRedirect);
  }

}
