import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutes} from './features.routes';
import {StoreModule} from "@ngrx/store";

@NgModule({
    imports: [FeaturesRoutes, CommonModule],
    declarations: [],
})
export class FeaturesModule {}
