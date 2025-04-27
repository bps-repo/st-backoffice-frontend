import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';

import {AppRoutes} from './app.routes';


import {provideState, provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideRouterStore, routerReducer} from '@ngrx/router-store';
import {tokenInterceptor} from './core/interceptors/token.interceptor';
import {authFeature} from './core/store/auth/reducers/auth.reducers';
import {AuthEffects} from './core/store/auth/effects/auth.effects';
import {CustomSerializer} from './core/router/custom-serializer';
import {classesFeature, scholarEffects, studentsFeature} from "./core/store/schoolar";

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
        provideState(studentsFeature),
        provideState(classesFeature),
        provideEffects(scholarEffects),
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
    ],
};
