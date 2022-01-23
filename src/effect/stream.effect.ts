import type { EventStream, EventSystem } from '@type/event.type';
import { dynamoDbConverter, kinesisClient } from '@utility/aws.utility';
import type { Kinesis } from 'aws-sdk';
import { defer, filter, map, mapTo, mergeMap, Observable } from 'rxjs';
import { retryOnError$ } from './retry.effect';
import { runEffects$ } from './run.effect';
import { toKinesisPut$ } from './transform.effect';

// Decode stream data.
const streamDecodeData = (data: string) => {
  return Buffer.from(data, 'base64').toString();
};

// Decode a record coming off of a stream.
export const streamDecodeRecord$ = (
  record$: Observable<EventStream>
): Observable<EventSystem> => {
  return record$.pipe(
    runEffects$(streamDecodeDynamoDbRecord$, streamDecodeKinesisRecord$),
    map((event) => event as EventSystem)
  );
};

// Decode a DynamoDB kinesis record.
const streamDecodeDynamoDbRecord$ = (
  record$: Observable<EventStream>
): Observable<EventSystem> => {
  return record$.pipe(
    filter((record) => typeof record.dynamodb !== 'undefined'),
    map((record) => {
      return dynamoDbConverter.unmarshall(
        record.dynamodb.NewImage
      ) as EventSystem;
    })
  );
};

// Decode a standard kinesis record.
const streamDecodeKinesisRecord$ = (
  record$: Observable<EventStream>
): Observable<EventSystem> => {
  return record$.pipe(
    filter((record) => typeof record.kinesis !== 'undefined'),
    map((record) => {
      return JSON.parse(streamDecodeData(record.kinesis.data));
    })
  );
};

// Write to a stream.
export const streamWrite$ = (streamName: string) => {
  return (event$: Observable<EventSystem>) => {
    return event$.pipe(toKinesisPut$(streamName), streamWriteRecord$);
  };
};

const streamWriteRecord$ = (record$: Observable<Kinesis.PutRecordInput>) => {
  return record$.pipe(
    mergeMap((record) => {
      return defer(() => kinesisClient.putRecord(record).promise()).pipe(
        retryOnError$({ message: `Attempting to write ${record}` }),
        mapTo(record)
      );
    })
  );
};
