import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

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
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { authFeature } from './core/store/reducers/auth.reducers';
import { AuthEffects } from './core/store/effects/auth.effects';
import { CustomSerializer } from './core/router/custom-serializer';

export const AppConfig: ApplicationConfig = {
    providers: [
        // HTTP
        provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),

        // Animations
        provideAnimations(),

        // Router
        provideRouter(
            AppRoutes,
            withComponentInputBinding()
        ),

        // NgRx Store
        provideStore({
            router: routerReducer
        }),
        provideState(authFeature),
        provideEffects([AuthEffects]),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 75
        }),

        // Router Store
        provideRouterStore({
            serializer: CustomSerializer
        }),

        // Feature Modules
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
