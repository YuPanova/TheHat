import { Injectable } from '@angular/core';
import { from, Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { GrammarCheckResponseInterface } from '../interfaces/grammarCheckResponse.interface';
import { LanguageCode } from '../../shared/enums/laguage.enum';
import { ImageResponseInterface } from '../interfaces/imagesResponse.interface';
import { words } from '../store/words.mock';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public images: Subject<ImageResponseInterface[]> = new Subject();
  private webWorker: Worker;

  public grammarCheck(word: string, languageCode = LanguageCode.EN): Observable<GrammarCheckResponseInterface> {
    const apiUrl = 'https://api.languagetoolplus.com/v2/check';

    const params = new URLSearchParams();
    params.append('text', word);
    params.append('language', languageCode);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept' : 'application/json'
      },
      body: params.toString()
    };

    return from(fetch(apiUrl, requestOptions)).pipe(
      switchMap(response => {
        if (!response.ok) {
          return throwError('Network response was not ok');
        }
        return from(response.json());
      }),
      catchError(error => {
        return throwError(`There was a problem with the fetch operation: ${error.message}`);
      })
    );
  }

  public createWebWorker(): void {
    if (window.Worker) {
      this.webWorker = new Worker('./worker.js');
    }
  }

  public terminateWebWorker(): void {
    if (window.Worker) {
      this.webWorker.terminate();
    }
  }

  public onWebWorker(word: string): void {
    if (this.webWorker) {
      this.webWorker.postMessage(word);

      const self = this;

      this.webWorker.addEventListener('message', function(event) {
        self.images.next(event.data)
      });

    } else {
      console.log('Your browser doesn\'t support web workers.!');
    }
  }

  public cacheMockedImages(): void {
    if ('caches' in window) {
      words.forEach(word => {
        word.urls.forEach(url => {
          caches.open('mocked_data').then(
            (cache) => {
              return fetch(url).then( res => {
                cache.put(url, res.clone());
              })
            }
          ). catch()
        })
      })
    }
  }
}
