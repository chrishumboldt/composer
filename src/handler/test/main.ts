import { logOut$ } from '@effect/log.effect';
import { responseSuccessEmpty$ } from '@effect/response.effect';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { lastValueFrom, of } from 'rxjs';

// The main test handler.
export const defaultHandler = async (event: APIGatewayProxyEvent) => {
  const eventPipe = of(event).pipe(logOut$('Test'), responseSuccessEmpty$);

  // Promise like resolution.
  return await lastValueFrom(eventPipe);
};
