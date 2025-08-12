import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

import { rolesReducer } from './roles/reducers/roles.reducer';
import { permissionsReducer } from './permissions/reducers/permissions.reducer';
import { RolesEffects } from './roles/effects/roles.effects';
import { PermissionsEffects } from './permissions/effects/permissions.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({
      roles: rolesReducer,
      permissions: permissionsReducer
    }),
    EffectsModule.forRoot([
      RolesEffects,
      PermissionsEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode in production
    })
  ],
  exports: [
    StoreModule,
    EffectsModule
  ]
})
export class AppStoreModule { }
