import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'app-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule
    ],
    templateUrl: './create.component.html',
})
export class CreateComponent {
    class: any = {
        name: '',
        code: '',
        level: null,
        teacher: null,
        startDate: null,
        endDate: null,
        schedule: '',
        capacity: 15,
        status: 'Active'
    };

    levels = [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
    ];

    teachers = [
        { label: 'John Smith', value: 'John Smith' },
        { label: 'Jane Doe', value: 'Jane Doe' },
        { label: 'Maria Rodriguez', value: 'Maria Rodriguez' },
        { label: 'Pierre Dupont', value: 'Pierre Dupont' }
    ];

    statuses = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];

    saveClass() {
        // In a real application, you would save the class data using a service
        console.log('Class saved:', this.class);
        // Navigate back to the list page
    }
}
