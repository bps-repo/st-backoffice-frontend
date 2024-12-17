import { Component } from '@angular/core';
import { TableClassesComponent } from 'src/app/shared/components/table-classes/table-classes.component';

@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [TableClassesComponent],
    templateUrl: './classes.component.html',
    styleUrl: './classes.component.scss',
})
export class ClassesComponent {}
