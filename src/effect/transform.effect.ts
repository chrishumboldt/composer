import { getMainStreamName } from '@data/environment.data';
import { EventSubject } from '@data/event.data';
import type { EventSystem } from '@type/event.type';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { Kinesis } from 'aws-sdk';
import { nanoid } from 'nanoid';
import type { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { runEffects$ } from './run.effect';

// Transform a system event into a Kinesis put.
export const toKinesisPut$ =
  (streamName = getMainStreamName()) =>
  (event$: Observable<EventSystem>): Observable<Kinesis.PutRecordInput> => {
    return event$.pipe(
      map((event) => {
        return {
          Data: event ? JSON.stringify(event) : {},
          PartitionKey: `${event?.subject}/${event?.topic}`,
          StreamName: streamName,
        };
      })
    );
  };

// Transform API Gateway events.
const toSystemEventApiGateway$ = (
  event$: Observable<APIGatewayProxyEvent>
): Observable<EventSystem> => {
  return event$.pipe(
    filter((event) => event.requestContext !== undefined),
    map((event) => {
      const nowDate = Date.now();
      const {
        action = '',
        body = {},
        eventId = nanoid(),
        subject = EventSubject.UNKNOWN,
        topic = '',
      } = event?.body ? JSON.parse(event.body) : {};

      // Return the event.
      return {
        action,
        body,
        eventId,
        metadata: {
          apiId: event?.requestContext?.apiId || '',
          connectionId: event?.requestContext?.connectionId || '',
          domainName: event?.requestContext?.domainName || '',
          requestTime: event?.requestContext?.requestTime || `${nowDate}`,
          requestTimeEpoch: event?.requestContext?.requestTimeEpoch || nowDate,
          stage: event?.requestContext?.stage || '',
        },
        subject,
        topic,
      };
    })
  );
};

// Pass system events through.
const toSystemEventPassThrough$ = (
  event$: Observable<EventSystem>
): Observable<EventSystem> => {
  return event$.pipe(
    filter((event) => !(event as any).requestContext),
    map((event: EventSystem) => {
      const { eventId = nanoid(), ...leftOvers } = event;

      // Return the event.
      return {
        eventId,
        ...leftOvers,
      };
    })
  );
};

// Transform any event into a Composer system event.
export const toSystemEvent$ = (
  event$: Observable<any>
): Observable<EventSystem> => {
  return event$.pipe(
    runEffects$(toSystemEventApiGateway$, toSystemEventPassThrough$),
    map((event) => event as EventSystem)
  );
};
