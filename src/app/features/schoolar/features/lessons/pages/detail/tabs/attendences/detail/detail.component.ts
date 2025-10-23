import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-student',
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TableModule,
        TagModule
    ],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
    attendanceId: string | null = null;
    attendance: any
    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.attendanceId = this.route.snapshot.paramMap.get('id')
    }

    getSeverity(status: string) {
        switch (status) {
            case 'Present':
                return 'success';
            case 'Absent':
                return 'danger';
            case 'Late':
                return 'warning';
            case 'Excused':
                return 'info';
            default:
                return 'info';
        }
    }

    getPresentCount(): number {
        return this.attendance.students.filter((s: { status: string; }) => s.status === 'Present').length;
    }

    getAbsentCount(): number {
        return this.attendance.students.filter((s: { status: string; }) => s.status === 'Absent').length;
    }

    getLateCount(): number {
        return this.attendance.students.filter((s: { status: string; }) => s.status === 'Late').length;
    }

    getExcusedCount(): number {
        return this.attendance.students.filter((s: { status: string; }) => s.status === 'Excused').length;
    }
}
