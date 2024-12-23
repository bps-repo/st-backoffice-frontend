import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { MaterialsCreateComponent } from './components/create/materials-create.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
             component: ListComponent,
                },

        {
            path: 'create',
            component: MaterialsCreateComponent,
         },
    ])],
    exports: [RouterModule]
})
export class MaterialsAppRoutingModule { }
