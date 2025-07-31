import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';

@Component({
    selector: 'scholar-student-lessons-tab',
    standalone: true,
    imports: [CommonModule, CardModule, TagModule],
    templateUrl: 'lessons.tab.component.html',
})
export class StudentLessonsTabComponent {
    lessons = [
        {
            titulo: 'Present Perfect',
            data: '2024-01-15',
            status: 'Presente',
            cor: 'info',
            nota: 8.5,
        },
        {
            titulo: 'Modal Verbs',
            data: '2024-01-14',
            status: 'Presente',
            cor: 'info',
            nota: 9,
        },
        {
            titulo: 'Passive Voice',
            data: '2024-01-12',
            status: 'Ausente',
            cor: 'danger',
            nota: null,
        },
    ];
}
