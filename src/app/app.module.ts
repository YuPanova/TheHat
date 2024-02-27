import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CorsInterceptor } from './cors-interceptor';
import { SettingsModule } from './settings/settings.module';
import { GameModule } from './game/game.module';
import { RulesModule } from './rules/rules.module';
import { HomeComponent } from './shared/components/home/home.component';
import { TopBarModule } from './shared/modules/top-bar/top-bar.module';
import { FooterModule } from './shared/modules/footer/footer.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([]),
    SettingsModule,
    GameModule,
    TopBarModule,
    FooterModule,
    RulesModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CorsInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
