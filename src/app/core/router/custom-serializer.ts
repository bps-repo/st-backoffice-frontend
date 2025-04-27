import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';

/**
 * Interface for the router state
 */
export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
  fragment: string | null;
}

/**
 * Custom serializer for router-store
 * This serializer extracts the parts of the router state that are needed for the application
 * and makes them available in a more convenient format
 */
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    // Extract params from all route segments
    let params: Params = {};
    while (route.firstChild) {
      route = route.firstChild;
      params = {
        ...params,
        ...route.params,
      };
    }

    // Only return the necessary parts of the router state
    const {
      url,
      root: { queryParams, fragment },
    } = routerState;

    return { url, params, queryParams, fragment };
  }
}
