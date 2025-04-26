import { ApplicationConfig, importProvidersFrom, isDevMode, } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors, } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {
    BrowserAnimationsModule,
    provideAnimations,
    provideNoopAnimations,
} from '@angular/platform-browser/animations';

import { AppRoutes } from './app.routes';

import { AuthModule } from './features/auth/auth.module';
import { ComunicationModule } from './features/comunication/comunication.module';
import { CoursesModule } from './features/courses/courses.module';
import { HumanResourcesModule } from './features/human-resources/human-resources.module';
import { InvoicesModule } from './features/invoices/invoices.module';
import { SchoolarModule } from './features/schoolar/schoolar.module';
import { SettingsModule } from './features/settings/settings.module';

import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { authFeature } from './core/store/reducers/auth.reducers';
import { AuthEffects } from './core/store/effects/auth.effects';

export const AppConfig: ApplicationConfig = {
  providers: [
    //provideClientHydration(),
    provideAnimationsAsync(),
    provideAnimations(),
    provideNoopAnimations(),
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideState(authFeature),
    provideEffects(AuthEffects),
    provideRouter(AppRoutes),
    importProvidersFrom(
      AuthModule,
      ComunicationModule,
      CoursesModule,
      HumanResourcesModule,
      InvoicesModule,
      SchoolarModule,
      SettingsModule,
      BrowserModule,
      BrowserAnimationsModule,

    ),
  ],
};
