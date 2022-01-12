import { responseError$, responseSuccessEmpty$ } from '@effect/response.effect';
import { streamWrite$ } from '@effect/stream.effect';
import { toSystemEvent$ } from '@effect/transform.effect';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { catchError, lastValueFrom, of } from 'rxjs';

// Default websocket route.
export const defaultHandler = async (event: APIGatewayProxyEvent) => {
  const eventPipe = of(event).pipe(
    toSystemEvent$,
    streamWrite$(), // Write to the main stream.
    responseSuccessEmpty$,
    catchError(responseError$)
  );

  // Promise like resolution.
  return await lastValueFrom(eventPipe);
};
