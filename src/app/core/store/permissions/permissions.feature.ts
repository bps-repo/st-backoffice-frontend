import { createFeature } from '@ngrx/store';
import { permissionsReducer } from './reducers/permissions.reducer';

export const permissionsFeature = createFeature({
  name: 'permissions',
  reducer: permissionsReducer
});
