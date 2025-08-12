import { createFeature } from '@ngrx/store';
import { rolesReducer } from './reducers/roles.reducer';

export const rolesFeature = createFeature({
  name: 'roles',
  reducer: rolesReducer
});
