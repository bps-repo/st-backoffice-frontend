import { Component, Input } from '@angular/core';
import {LessonEvent} from "../../../core/models/academic/lesson-event";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-event-tooltip',
    templateUrl: './event-tooltip.component.html',
    styleUrls: ['./event-tooltip.component.scss'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class EventTooltipComponent {
    @Input() title: string = '';
    @Input() description: string = 'Sem descrição';
    @Input() data!: LessonEvent;
    @Input() position: { x: number; y: number } = { x: 0, y: 0 };
}
