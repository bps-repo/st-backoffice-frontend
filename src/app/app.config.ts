import { ApplicationConfig, importProvidersFrom } from '@angular/core';
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

export const AppConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideAnimations(),
    provideNoopAnimations(),
    provideHttpClient(withFetch()),
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
