import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from 'src/app/shared/@types/tab';
import { TabViewComponent } from 'src/app/shared/components/tab-view/tab-view.component';
import { STUDENTS_TABS } from 'src/app/shared/constants/students';
import { Observable } from 'rxjs';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { BadgeModule } from 'primeng/badge';
import { StudentService } from 'src/app/core/services/students.service';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [
        TabMenuModule,
        TabViewModule,
        CommonModule,
        TabViewComponent,
        SplitButtonModule,
        TagModule,
        PanelModule,
        BadgeModule,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
    tabs: Observable<Tab[]> = STUDENTS_TABS;
    items!: MenuItem[];

    constructor(private studentService: StudentService) {
        this.studentService.getById(1).subscribe((student) => {
            console.log('AQUI PEGANDO STUDENT');
            console.log(student);
        });
    }

    ngOnInit() {
        this.items = [
            { label: 'Imprimir cartão', icon: 'pi pi-file-pdf' },
            {
                label: 'Ficha de Inscrição',
                icon: 'pi pi-file-pdf',
                items: [
                    { label: 'Gerar', icon: 'pi pi-plus' },
                    { label: 'Imprimir', icon: 'pi pi-file-pdf' },
                    { label: 'Enviar por e-mais', icon: 'pi pi-at' },
                ],
            },
            { label: 'Inscrição turma', icon: 'pi pi-user-edit' },
            { label: 'Enviar mensagem', icon: 'pi pi-comments' },
            { separator: true },
            { label: 'Actualizar', icon: 'pi pi-user-edit' },
            {
                label: 'Inactivar',
                icon: 'pi pi-times',
                styleClass: 'text-red-500',
                tooltip: 'Desactivar o aluno',
            },
        ];
    }
}
