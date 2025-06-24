import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Exam } from 'src/app/core/models/academic/exam';
import { selectSelectedExam } from 'src/app/core/store/schoolar/assessments/exams.selectors';

@Component({
    selector: 'app-general',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './general.component.html'
})
export class GeneralComponent implements OnInit {
    exam$: Observable<Exam | null>;

    constructor(private store: Store) {
        this.exam$ = this.store.select(selectSelectedExam);
    }

    ngOnInit(): void {
        // Component initialization logic
    }
}
