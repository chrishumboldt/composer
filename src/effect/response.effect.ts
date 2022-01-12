import type { ResponseGeneratorParams } from '@type/response.type';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Return an error response.
export const responseError$ = (event$: Observable<any>) => {
  return event$.pipe(
    map((event) => responseGenerator({ body: event, statusCode: 400 }))
  );
};

// Return a response.
const responseGenerator = ({ body, statusCode }: ResponseGeneratorParams) => {
  return {
    body: JSON.stringify(body),
    statusCode,
  };
};

// Return a successful response.
export const responseSuccess$ = (event$: Observable<any>) => {
  return event$.pipe(
    map((event) => responseGenerator({ body: event, statusCode: 200 }))
  );
};

// Return a successful empty response.
export const responseSuccessEmpty$ = (event$: Observable<any>) => {
  return event$.pipe(
    map(() =>
      responseGenerator({
        body: {
          message: 'success',
        },
        statusCode: 200,
      })
    )
  );
};
