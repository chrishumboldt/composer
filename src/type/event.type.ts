export interface EventStream {
  awsRegion: string;
  dynamodb?: EventStreamDynamoDb;
  kinesis?: EventStreamKinesis;
}

interface EventStreamDynamoDb {
  ApproximateCreationDateTime: string;
  NewImage: any;
}

interface EventStreamKinesis {
  approximateArrivalTimestamp: number;
  data: string;
}

export interface EventStreamRecords {
  Records: EventStream[];
}

export interface EventSystem<T = unknown> {
  action?: string;
  body?: T;
  eventId: string;
  metadata: {
    apiId?: string;
    connectionId?: string;
    domainName?: string;
    requestTime?: string;
    requestTimeEpoch?: number;
    stage?: string;
  };
  subject: string;
  topic?: string;
}
