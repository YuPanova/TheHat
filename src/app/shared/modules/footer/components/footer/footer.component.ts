import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as DOMPurify from 'dompurify';
import filterXSS from 'xss';

import { resultsSelector } from '../../store/selectors';
import { ResultsInterface } from '../../../../../settings/interfaces/settingsState.interface';

@Component({
  selector: 'h-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy{
  results: ResultsInterface[];
  showResults = false;
  private readonly unsubscriber: Subject<void> = new Subject();

  // for sanitizes
  showSanitizes = false;
  domPurified: string;
  sanitized: SafeHtml;
  xssSanitized: string;
  txt: string;
  xssText: string;

  constructor(
    private store: Store,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscriber),
      )
      .subscribe((res: NavigationEnd) => {
        this.showResults = res.url.includes('/game');
      });

    this.store.pipe(select(resultsSelector), takeUntil(this.unsubscriber)).subscribe(
      res => {
        this.results = res;
      }
    )

    if (this.showSanitizes){ this.initSanitizersForTest() }
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private initSanitizersForTest(): void {
    this.txt = `<b>hello there</b> <a href=\"#\" onclick=\"alert(/xss/)\">click me</a> <TABLE><tr><td>HELLO</tr></TABL>`;
    this.domPurified = DOMPurify.sanitize(this.txt);
    this.sanitized = this.sanitizer.bypassSecurityTrustHtml(this.txt);
    this.xssSanitized = filterXSS('<b>hello there</b> <a href="#" onclick="alert(/xss/)">click me</a> <TABLE><tr><td>HELLO</tr></TABL>');
    this.xssText = `filterXSS('<b>hello there</b> <a href="#" onclick="alert(/xss/)">click me</a> <TABLE><tr><td>HELLO</tr></TABL>')`;
  }

}
