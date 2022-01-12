import { responseSuccessEmpty$ } from '@effect/response.effect';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { lastValueFrom, of } from 'rxjs';

// Handle a websocket connection.
export const defaultHandler = async (event: APIGatewayProxyEvent) => {
  const eventPipe = of(event).pipe(responseSuccessEmpty$);

  // Promise like resolution.
  return await lastValueFrom(eventPipe);
};
