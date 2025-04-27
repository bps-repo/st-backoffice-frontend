import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-detail',
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
    attendance: any = {
        id: 1,
        date: '2023-06-01',
        class: {
            name: 'English Intermediate',
            code: 'ENG201',
            teacher: 'John Smith'
        },
        students: [
            { id: 1, name: 'John Doe', status: 'Present', notes: 'Arrived on time' },
            { id: 2, name: 'Jane Smith', status: 'Absent', notes: 'Sick leave' },
            { id: 3, name: 'Michael Johnson', status: 'Present', notes: '' },
            { id: 4, name: 'Emily Brown', status: 'Late', notes: 'Arrived 10 minutes late' },
            { id: 5, name: 'David Wilson', status: 'Present', notes: '' }
        ],
        createdBy: 'Admin User',
        createdAt: '2023-06-01 09:00:00',
        updatedAt: '2023-06-01 09:00:00'
    };

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.attendanceId = this.route.snapshot.paramMap.get('id');
        // In a real application, you would fetch the attendance data from a service
        // this.attendanceService.getAttendance(this.attendanceId).subscribe(data => {
        //     this.attendance = data;
        // });
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
