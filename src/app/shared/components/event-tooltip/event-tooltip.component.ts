import { Component, Input } from '@angular/core';
import { LessonEvent } from 'src/app/core/models/lesson';

@Component({
    selector: 'app-event-tooltip',
    templateUrl: './event-tooltip.component.html',
    styleUrls: ['./event-tooltip.component.scss'],
})
export class EventTooltipComponent {
    @Input() title: string = '';
    @Input() description: string = 'Sem descrição';
    @Input() data!: LessonEvent;
    @Input() position: { x: number; y: number } = { x: 0, y: 0 };
}
