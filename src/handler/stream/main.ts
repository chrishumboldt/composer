import { fanOut$ } from '@effect/fan-out.effect';
import { streamDecodeRecord$ } from '@effect/stream.effect';
import type { EventStreamRecords } from '@type/event.type';
import { from, lastValueFrom } from 'rxjs';

// Handle all events coming off the main kinesis stream.
export const defaultHandler = async (events: EventStreamRecords) => {
  const eventPipe = from(events.Records).pipe(streamDecodeRecord$, fanOut$);

  // Promise like resolution.
  return await lastValueFrom(eventPipe);
};
