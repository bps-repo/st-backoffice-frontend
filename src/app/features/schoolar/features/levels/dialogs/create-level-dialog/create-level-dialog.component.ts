import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Level } from 'src/app/core/models/course/level';
//import { Service } from 'src/app/core/models/course/service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as LevelActions from 'src/app/core/store/course/actions/level.actions';
//import * as ServiceActions from 'src/app/core/store/course/actions/service.actions';
import { selectLevelError, selectLevelLoading } from 'src/app/core/store/course/selectors/level.selector';
//import { selectAllServices } from 'src/app/core/store/course/selectors/service.selector';

@Component({
    selector: 'app-create-level-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule
    ],
    templateUrl: './create-level-dialog.component.html'
})
export class CreateLevelDialogComponent implements OnInit {

    visible: boolean = false;

    level: Partial<Level> = {
        name: '',
        description: '',
        duration: 0,
        maximumUnits: 0,
        //course: undefined
      };


    loading$: Observable<boolean>;
    error$: Observable<any>;
    //courseOptions$: Observable<Service[]>;

    constructor(private store: Store) {
        this.loading$ = this.store.select(selectLevelLoading);
        this.error$ = this.store.select(selectLevelError);
        //this.courseOptions$ = this.store.select(selectAllServices);
    }

    ngOnInit() {
        this.error$.subscribe((error) => {
            if (error) {
                console.error('Erro ao criar o Level:', error);
            }
        });

       //this.store.dispatch(ServiceActions.loadPagedServices({ size: 10 }));
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    saveLevel() {
        const payload = {
            name: this.level.name,
            description: this.level.description,
            duration: this.level.duration,
            maximumUnits: this.level.maximumUnits,
            //course: this.level.course

        };

        console.log('Payload:', payload);

        this.store.dispatch(LevelActions.createLevel({ level: payload }));

        this.store.select(selectLevelError).subscribe(error => {
            if (!error) {
                this.hide();
                this.resetForm();
            }
        });
    }

    resetForm() {
        this.level = {
            name: '',
            description: '',
            duration: 0,
            maximumUnits: 0,
            //course: undefined
        };
    }
}
