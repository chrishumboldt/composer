import type { RetryOnErrorParams } from '@type/retry.type';
import {
  catchError,
  delay,
  Observable,
  of,
  retryWhen,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

// Simple retry observable on error operator.
export const retryOnError$ =
  <T>({ message, attempts = 3, backoffMS = 500 }: RetryOnErrorParams) =>
  (source$: Observable<T>) => {
    return source$.pipe(
      retryWhen((errorStream$) => {
        return errorStream$.pipe(
          switchMap((e) => {
            return attempts-- > 0
              ? of(e).pipe(
                  delay(backoffMS || 1),
                  tap((err) => {
                    console.log(
                      'retryOnError$',
                      {
                        error: err,
                        metadata: { attempts, backoffMS },
                      },
                      message
                    );
                  })
                )
              : throwError(e);
          })
        );
      }),
      catchError((error) => throwError(error))
    );
  };
