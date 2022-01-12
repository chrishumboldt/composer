import type { EventSystem } from '@type/event.type';
import type { Observable } from 'rxjs';
import { logOut$ } from './log.effect';

// Fan out an event to the desired lambdas.
export const fanOut$ = (event$: Observable<EventSystem>) => {
  return event$.pipe(logOut$('Fan out here'));
};
