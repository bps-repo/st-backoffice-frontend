import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing.module';
import { ChartModule } from 'primeng/chart';

@NgModule({
    imports: [FeaturesRoutingModule, CommonModule, ChartModule],
    declarations: [],
})
export class FeaturesModule {}
