import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolarRoutes } from './schoolar.routes';
import { provideState, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { classesFeature, scholarEffects, studentsFeature } from './store';

/**
 * @deprecated Use standalone components and functional providers instead
 * Example:
 * ```
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideState(studentsFeature),
 *     provideState(classesFeature),
 *     provideEffects(scholarEffects)
 *   ]
 * });
 * ```
 */
@NgModule({
    imports: [
        SchoolarRoutes,
        CommonModule,
        StoreModule.forFeature(studentsFeature),
        StoreModule.forFeature(classesFeature),
        EffectsModule.forFeature(scholarEffects)
    ],
    declarations: [],
})
export class SchoolarModule {}
