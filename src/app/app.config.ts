import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutes } from './app.routes';
import { FeatureSlice, provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { CustomSerializer } from './core/router/custom-serializer';
import { AppEffects, AppFeatures } from "./core/store";
import { forbiddenInterceptor } from "./core/interceptors/forbidden.interceptor";
import { MessageService } from "primeng/api";
// YouTube Player is imported directly in components that need it

export const AppConfig: ApplicationConfig = {
    providers: [
        MessageService,
        // HTTP
        provideHttpClient(
            withFetch(),
            withInterceptors([tokenInterceptor, forbiddenInterceptor])
        ),
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
        ...AppFeatures.map(
            (feature) => provideState(feature as FeatureSlice<any>)
        ),
        provideEffects(AppEffects),
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
