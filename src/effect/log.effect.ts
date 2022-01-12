import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Log out the value in the observable.
export const logOut$ =
  (prefix = 'LOG', stringify = true) =>
  (event$: Observable<any>) => {
    return event$.pipe(
      tap((event) => {
        console.log(
          `[${prefix.toUpperCase()}]`,
          stringify ? JSON.stringify(event) : event
        );
      })
    );
  };
