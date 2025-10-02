import { createFeature } from '@ngrx/store';
import { rolesReducer } from './roles.reducer';

export const rolesFeature = createFeature({
  name: 'roles',
  reducer: rolesReducer
});
