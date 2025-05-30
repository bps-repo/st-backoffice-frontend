import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from 'src/app/shared/@types/tab';
import { TabViewComponent } from 'src/app/shared/components/tables/tab-view/tab-view.component';
import { ASSESSMENTS_TABS } from 'src/app/shared/constants/reviews';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { examsActions } from 'src/app/core/store/schoolar';
import { selectSelectedExam } from 'src/app/core/store/schoolar/selectors/exams.selectors';
import { Exam } from 'src/app/core/models/academic/exam';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [
        TabMenuModule,
        TabViewModule,
        CommonModule,
        TabViewComponent,
        SplitButtonModule,
    ],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit, OnDestroy {
    tabs!: Observable<Tab[]>;
    items!: MenuItem[];
    exam: Exam | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit() {
        this.tabs = ASSESSMENTS_TABS;

        // Get the exam ID from the route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    // Dispatch action to load the exam
                    this.store.dispatch(examsActions.loadExam({ id }));
                }
            });

        // Subscribe to the selected exam
        this.store.select(selectSelectedExam)
            .pipe(takeUntil(this.destroy$))
            .subscribe(exam => {
                this.exam = exam;
            });

        this.items = [
            { label: 'Edit Evaluation', icon: 'pi pi-pencil' },
            { label: 'Add Student', icon: 'pi pi-user-plus' },
            { separator: true },
            { label: 'Print Evaluation Report', icon: 'pi pi-file-pdf' },
            { label: 'Export Results', icon: 'pi pi-file-excel' },
            { separator: true },
            {
                label: 'Cancel Evaluation',
                icon: 'pi pi-times',
                styleClass: 'text-red-500',
                tooltip: 'Cancel this evaluation',
            },
        ];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
